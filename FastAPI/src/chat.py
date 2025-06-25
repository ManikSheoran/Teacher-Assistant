from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import Tool, AgentExecutor, create_react_agent
from langchain import hub
from .meet import create_meet_event
from .crud import get_all_subjects, get_teacher_by_subject, get_student_by_roll
from .models import ChatEntry
from typing import List
from langchain_core.messages import HumanMessage, AIMessage

def desc_gen():
    subjects = get_all_subjects()
    return (
        "This tool is used to schedule a Google Meet between a student and a teacher. "
        "It takes a subject as input from the following list: "
        f"{', '.join(subjects)}. "
        "The tool then fetches the relevant teacher and student details to create the meeting."
    )

def schedule_meeting_tool(subject: str, student_roll: str):
    """Fetches teacher and student and creates a meeting."""
    print(f"[schedule_meeting_tool] Called with subject: {subject}, student_roll: {student_roll}")

    teacher = get_teacher_by_subject(subject)
    print(f"[schedule_meeting_tool] Fetched teacher: {teacher}")
    if not teacher:
        return f"Could not find a teacher for the subject: {subject}"

    student = get_student_by_roll(student_roll)
    print(f"[schedule_meeting_tool] Fetched student: {student}")
    if not student:
        return f"Could not find a student with roll number: {student_roll}"

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

class DoubtAgent:
    def __init__(self, api_key: str, student_roll: str, chat_history: List[ChatEntry]):
        self.model = ChatGoogleGenerativeAI(api_key=api_key, model='models/gemini-1.5-flash')
        self.student_roll = student_roll
        self.chat_history = chat_history
        
        description = desc_gen()
        
        def tool_wrapper(subject: str):
            return schedule_meeting_tool(subject=subject, student_roll=self.student_roll)

        create_meet_tool = Tool(
            name="create_meet_event",
            func=tool_wrapper,
            description=description
        )
        tools = [create_meet_tool]

        prompt = hub.pull("hwchase17/react-chat")
        # print("prompt is :-",str(prompt))
        agent = create_react_agent(self.model, tools, prompt)
        self.agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True)

    def get_response(self, query: str):
        formatted_history = []
        for entry in self.chat_history:
            formatted_history.append(HumanMessage(content=entry.Query))
            formatted_history.append(AIMessage(content=entry.Answer))

        response = self.agent_executor.invoke({
            "input": query,
            "chat_history": formatted_history
        })
        return response["output"]
        