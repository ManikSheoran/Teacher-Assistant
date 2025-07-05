from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any

class TeacherModel(BaseModel):
    id: str = Field(..., alias="_id")
    email: EmailStr
    name: str
    subject:str
    students: Optional[list] = []
    salt: str
    hash: str
    __v: int

class StudentModel(BaseModel):
    id: str = Field(..., alias="_id")
    email: EmailStr
    name: str
    roll: str
    feedback: Optional[list] = []
    salt: str
    hash: str
    __v: int

class ChatEntry(BaseModel):
    Query: str
    Answer: str

class ChatModel(BaseModel):
    id: str = Field(..., alias="_id")
    stud_roll: str
    chats: List[ChatEntry]
