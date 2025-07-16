from fastapi import FastAPI, HTTPException
from typing import List
from src.models import TeacherModel, StudentModel, ChatModel, ChatEntry
from src.crud import (
    get_all_teachers, 
    get_all_students, 
    get_chat_by_roll, 
    update_chat_by_roll,
    add_chat_entry
)
from pydantic import BaseModel
from src.chat import DoubtAgent
from dotenv import load_dotenv
load_dotenv()
import os

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
app = FastAPI()

@app.get("/teachers", response_model=List[TeacherModel])
def read_teachers():
    return get_all_teachers()

@app.get("/students", response_model=List[StudentModel])
def read_students():
    return get_all_students()

@app.get("/chats/{stud_roll}", response_model=ChatModel)
def read_chat(stud_roll: str):
    chat = get_chat_by_roll(stud_roll)
    if chat:
        return chat
    raise HTTPException(status_code=404, detail="Chat not found")

@app.put("/chats/{stud_roll}", response_model=bool)
def update_chat(stud_roll: str, chats: List[ChatEntry]):
    updated = update_chat_by_roll(stud_roll, chats)
    if updated:
        return True
    raise HTTPException(status_code=404, detail="Chat not found or not updated")

# Request model for agent endpoint
class AgentRequest(BaseModel):
    query: str
    student_roll: str

@app.post("/agent/ask")
def agent_ask(request: AgentRequest):
    # 1. Get history
    chat_history_doc = get_chat_by_roll(request.student_roll)
    chat_history = chat_history_doc.chats if chat_history_doc else []

    # 2. Call agent with history
    agent = DoubtAgent(
        api_key=GEMINI_API_KEY, 
        student_roll=request.student_roll, 
        chat_history=chat_history
    )
    response = agent.get_response(request.query)

    # 3. Store new entry
    add_chat_entry(stud_roll=request.student_roll, query=request.query, answer=response)

    return {"response": response}

