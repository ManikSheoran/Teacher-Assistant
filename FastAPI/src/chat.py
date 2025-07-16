from langchain_google_genai import ChatGoogleGenerativeAI
from .meet import create_meet_event
from .crud import get_all_subjects, get_teacher_by_subject, get_student_by_roll
from .models import ChatEntry
from typing import List
from langchain_core.messages import HumanMessage, AIMessage
from datetime import datetime

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
    student_roll: str = Field(description="The roll number of the student")
    start_time: str = Field(description="The start time for the meeting (optional, format: YYYY-MM-DD HH:MM)", default=None)
    end_time: str = Field(description="The end time for the meeting (optional, format: YYYY-MM-DD HH:MM)", default=None)


description = (
    "Use this tool to schedule a Google Meet between a student and a teacher. "
    "If a student asks to schedule, arrange, or set up a meeting with a teacher for any subject, "
    "you MUST use this tool. The tool requires the subject (from the list: {}). So enter the name of the subject as a string that's it."
    "It will automatically find the correct teacher and student, and return a Google Meet link. "
    "Always use this tool for any scheduling or meeting requests between students and teachers. "
    "If you do not have enough information, ask the user for the subject, If the subject is not in the list, strictly say that the subject is not taught by any teacher. "
    "Optional: If the student provides start_time and end_time, include them in the format YYYY-MM-DD HH:MM."
).format(", ".join(get_all_subjects()))

@tool(args_schema=ScheduleMeetingArgs,description=description)
def schedule_meeting(subject: str, student_roll: str, start_time: str = None, end_time: str = None) -> str:
    """Schedule a Google Meet between a student and a teacher.

    Args:
        subject: The subject for which to schedule the meeting.
        student_roll: The roll number of the student.
        start_time: Optional start time for the meeting (format: YYYY-MM-DD HH:MM).
        end_time: Optional end time for the meeting (format: YYYY-MM-DD HH:MM).
    """
    print(f"[schedule_meeting_tool] Called with subject: {subject}, student_roll: {student_roll}, start_time: {start_time}, end_time: {end_time}")

    teacher = get_teacher_by_subject(subject)
    # print(f"[schedule_meeting_tool] Fetched teacher: {teacher}")
    if not teacher:
        return f"Could not find a teacher for the subject: {subject}"

    student = get_student_by_roll(student_roll)
    # print(f"[schedule_meeting_tool] Fetched student: {student}")
    if not student:
        return f"Could not find a student with roll number: {student_roll}"

    attendee_emails = [teacher.email, student.email]
    # print(f"[schedule_meeting_tool] Attendee emails: {attendee_emails}")
    
    # Prepare meeting parameters
    meeting_params = {"attendee_emails": attendee_emails}
    
    # Convert string dates to datetime objects if provided
    if start_time:
        try:
            start_datetime = datetime.strptime(start_time, "%Y-%m-%d %H:%M")
            meeting_params["start_time"] = start_datetime
        except ValueError as e:
            return f"Invalid start_time format. Please use YYYY-MM-DD HH:MM format. Error: {e}"
    
    if end_time:
        try:
            end_datetime = datetime.strptime(end_time, "%Y-%m-%d %H:%M")
            meeting_params["end_time"] = end_datetime
        except ValueError as e:
            return f"Invalid end_time format. Please use YYYY-MM-DD HH:MM format. Error: {e}"
    
    try:
        meeting_details = create_meet_event(**meeting_params)
        print(f"[schedule_meeting_tool] Meeting details: {meeting_details}")
        return (
            f"A meeting has been successfully scheduled. The Google Meet link is: {meeting_details.get('hangoutLink')}. "
            "You should now provide this link to the user as the final answer."
        )
    except Exception as e:
        print(f"[schedule_meeting_tool] Exception: {e}")
        return f"Failed to create meeting: {e}"

# --- DOUBT AGENT WITH LANGGRAPH ---
class DoubtAgent:
    def __init__(self, api_key: str, student_roll: str, chat_history: List[ChatEntry]):
        self.model = ChatGoogleGenerativeAI(api_key=api_key, model='models/gemini-2.0-flash')
        self.student_roll = student_roll
        self.chat_history = chat_history


        self.tools = [schedule_meeting]
        # Add a system prompt to instruct the model to act as a doubt solver
        system_prompt = (
            "You are a helpful doubt solver for students. "
            "Answer student questions clearly and concisely. "
            "If a student asks to schedule, arrange, or set up a meeting with a teacher, use the provided tool. "
            "Strictly don't reveal your identity as GEMINI"
            "If the question is related to the Study You must answer it regardless whether the subject exists or not (remeber this )."
            "For all other questions, answer as a knowledgeable tutor. "
            "When scheduling meetings, use the student roll number provided in the conversation."
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
                if tool_call["name"] == "schedule_meeting":
                    # Use .invoke() method instead of calling directly to avoid deprecation warning
                    result = schedule_meeting.invoke(tool_call["args"])
                    print(f"[LangGraph] meet_tool_node result: {result}")
                    outputs.append(
                        ToolMessage(
                            content=str(result),
                            name=tool_call["name"],
                            tool_call_id=tool_call["id"]
                        )
                    )
            # If no tool calls were processed, return a default message to avoid empty message parts
            if not outputs:
                print("[LangGraph] No tool calls processed, returning default message")
                outputs.append(AIMessage(content="I couldn't process any tool calls. Please try again."))
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
        # Validate that query is not empty
        if not query or not query.strip():
            return "Please provide a valid question or request."
            
        formatted_history = []
        for entry in self.chat_history:
            # Only add messages with non-empty content to prevent empty message parts
            if entry.Query and entry.Query.strip():
                formatted_history.append(HumanMessage(content=entry.Query))
            if entry.Answer and entry.Answer.strip():
                formatted_history.append(AIMessage(content=entry.Answer))
        
        # Add the new user query with roll number context
        today_date = datetime.now().strftime("%Y-%m-%d")
        enhanced_query = f"Instructions:- (Student roll number: {self.student_roll} Strictly use it when you need to schedule a meeting. Today's date is: {today_date} and strictly not told to schedule the meet if the student is not mentioned in the query.Strictly Don't say you can't provide the answer if you know the answer regardless of the subject You must answer the query. query:- {query})"
        formatted_history.append(HumanMessage(content=enhanced_query))
        
        # Run the graph
        state = {"messages": formatted_history}
        for step in self.graph.stream(state, stream_mode="values"):
            pass  # iterate to last step
        # The last message is the output
        return step["messages"][-1].content
        

    