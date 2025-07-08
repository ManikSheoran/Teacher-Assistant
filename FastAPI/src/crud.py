from .db import teachers_collection, students_collection, chats_collection
from .models import TeacherModel, StudentModel, ChatModel, ChatEntry
from typing import List, Optional

def fix_id(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

# --- Teachers ---
def get_all_teachers() -> List[TeacherModel]:
    teachers = []
    for doc in teachers_collection.find():
        teachers.append(TeacherModel(**fix_id(doc)))
    return teachers

def get_all_subjects() -> List[str]:
    subjects = teachers_collection.distinct("subject")
    return subjects

def get_teacher_by_subject(subject: str) -> Optional[TeacherModel]:
    doc = teachers_collection.find_one({"subject": subject})
    if doc:
        return TeacherModel(**fix_id(doc))
    return None

# --- Students ---
def get_all_students() -> List[StudentModel]:
    students = []
    for doc in students_collection.find():
        students.append(StudentModel(**fix_id(doc)))
    return students

def get_student_by_roll(roll: str) -> Optional[StudentModel]:
    doc = students_collection.find_one({"roll": roll})
    if doc:
        return StudentModel(**fix_id(doc))
    return None

# --- Chats ---
def get_chat_by_roll(stud_roll: str) -> Optional[ChatModel]:
    doc = chats_collection.find_one({"stud_roll": stud_roll})
    if doc:
        return ChatModel(**fix_id(doc))

def update_chat_by_roll(stud_roll: str, new_chats: List[ChatEntry]) -> bool:
    result = chats_collection.update_one(
        {"stud_roll": stud_roll},
        {"$set": {"chats": [chat.dict() for chat in new_chats]}}
    )
    return result.modified_count > 0

def add_chat_entry(stud_roll: str, query: str, answer: str):
    """Adds a new chat entry to a student's chat history.
    
    If the student has no history, a new document is created.
    The history is capped at the last 10 entries.
    """
    chat_entry = ChatEntry(Query=query, Answer=answer)

    chats_collection.update_one(
        {"stud_roll": stud_roll},
        {
            "$push": {
                "chats": {
                    "$each": [chat_entry.dict()],
                    "$slice": -10  # Keeps the last 10 entries
                }
            }
        },
        upsert=True  # Creates the document if it doesn't exist
    )
