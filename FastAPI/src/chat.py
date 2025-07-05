from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import Tool, AgentExecutor, create_react_agent
from langchain import hub
from .meet import create_meet_event
from .crud import get_all_subjects, get_teacher_by_subject, get_student_by_roll
from .models import ChatEntry
from typing import List
from langchain_core.messages import HumanMessage, AIMessage

# --- LANGGRAPH IMPORTS ---
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage, ToolMessage
from pydantic import BaseModel, Field
from langchain_core.tools import tool

# --- STATE DEFINITION ---
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]

class ScheduleMeetingArgs(BaseModel):
    subject: str = Field(description="The subject for which to schedule the meeting")
# --- DOUBT AGENT WITH LANGGRAPH ---
class DoubtAgent:
    def __init__(self, api_key: str, student_roll: str, chat_history: List[ChatEntry]):
        self.model = ChatGoogleGenerativeAI(api_key=api_key, model='models/gemini-1.5-flash')
        self.student_roll = student_roll
        self.chat_history = chat_history

        description = (
            "Use this tool to schedule a Google Meet between a student and a teacher. "
            "If a student asks to schedule, arrange, or set up a meeting with a teacher for any subject, "
            "you MUST use this tool. The tool requires the subject (from the list: {}). So enter the name of the subject as a string that's it."
            "It will automatically find the correct teacher and student, and return a Google Meet link. "
            "Always use this tool for any scheduling or meeting requests between students and teachers. "
            "If you do not have enough information, ask the user for the subject"
        ).format(", ".join(get_all_subjects()))

        self.tools = [self.schedule_meeting]
        # Add a system prompt to instruct the model to act as a doubt solver
        system_prompt = (
            "You are a helpful doubt solver for students. "
            "Answer student questions clearly and concisely. "
            "If a student asks to schedule, arrange, or set up a meeting with a teacher, use the provided tool. "
            "For all other questions, answer as a knowledgeable tutor."
        )
        self.model_with_tools = self.model.bind_tools(self.tools).with_config({"system_message": system_prompt})
        print(f"[LangGraph] Model with tools: {self.model_with_tools}")
        # --- NODES ---
        def llm_node(state: AgentState):
            print("[LangGraph] Node: llm_node")
            response = self.model_with_tools.invoke(state["messages"])
            print(f"[LangGraph] LLM response: {response}")
            if hasattr(response, 'tool_calls'):
                print(f"[LangGraph] LLM tool_calls: {response.tool_calls}")
            return {"messages": [response]}

        def meet_tool_node(state: AgentState):
            print("[LangGraph] Node: meet_tool_node")
            messages = state["messages"]
            last_message = messages[-1]
            outputs = []
            for tool_call in getattr(last_message, "tool_calls", []):
                print(f"[LangGraph] meet_tool_node tool_call: {tool_call}")
                if tool_call["name"] == "create_meet_event":
                    result = self.schedule_meeting(**tool_call["args"])
                    print(f"[LangGraph] meet_tool_node result: {result}")
                    outputs.append(
                        ToolMessage(
                            content=str(result),
                            name=tool_call["name"],
                            tool_call_id=tool_call["id"]
                        )
                    )
            return {"messages": outputs}

        # --- CONDITIONAL EDGE LOGIC ---
        def route(state: AgentState):
            messages = state["messages"]
            last = messages[-1]
            if hasattr(last, "tool_calls") and last.tool_calls:
                return "meet_tool"
            return "end"

        # --- GRAPH DEFINITION ---
        builder = StateGraph(AgentState)
        builder.add_node("llm", llm_node)
        builder.add_node("meet_tool", meet_tool_node)
        builder.set_entry_point("llm")
        builder.add_conditional_edges(
            "llm", route, {"meet_tool": "meet_tool", "end": END}
        )
        builder.add_edge("meet_tool", "llm")
        self.graph = builder.compile()

    def get_response(self, query: str):
        formatted_history = []
        for entry in self.chat_history:
            formatted_history.append(HumanMessage(content=entry.Query))
            formatted_history.append(AIMessage(content=entry.Answer))
        # Add the new user query
        formatted_history.append(HumanMessage(content=query))
        # Run the graph
        state = {"messages": formatted_history}
        for step in self.graph.stream(state, stream_mode="values"):
            pass  # iterate to last step
        # The last message is the output
        return step["messages"][-1].content
    
    @tool(parse_docstring=True,description=description)
    def schedule_meeting(self, subject: str) -> str:
        """Schedule a Google Meet between a student and a teacher.

        Args:
            subject: The subject for which to schedule the meeting.
        """
        print(f"[schedule_meeting_tool] Called with subject: {subject}, student_roll: {self.student_roll}")

        teacher = get_teacher_by_subject(subject)
        print(f"[schedule_meeting_tool] Fetched teacher: {teacher}")
        if not teacher:
            return f"Could not find a teacher for the subject: {subject}"

        student = get_student_by_roll(self.student_roll)
        print(f"[schedule_meeting_tool] Fetched student: {student}")
        if not student:
            return f"Could not find a student with roll number: {self.student_roll}"

        attendee_emails = [teacher.email, student.email]
        print(f"[schedule_meeting_tool] Attendee emails: {attendee_emails}")
        try:
            meeting_details = create_meet_event(attendee_emails=attendee_emails)
            print(f"[schedule_meeting_tool] Meeting details: {meeting_details}")
            return (
                f"A meeting has been successfully scheduled. The Google Meet link is: {meeting_details.get('hangoutLink')}. "
                "You should now provide this link to the user as the final answer."
            )
        except Exception as e:
            print(f"[schedule_meeting_tool] Exception: {e}")
            return f"Failed to create meeting: {e}"
        