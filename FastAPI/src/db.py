from pymongo import MongoClient

MONGO_DETAILS = "mongodb://localhost:27017"
client = MongoClient(MONGO_DETAILS)
db = client.neurograde

REQUIRED_COLLECTIONS = ["teachers", "students", "chats"]

def ensure_collections():
    existing = db.list_collection_names()
    for name in REQUIRED_COLLECTIONS:
        if name not in existing:
            db.create_collection(name)

ensure_collections()

teachers_collection = db.get_collection("teachers")
students_collection = db.get_collection("students")
chats_collection = db.get_collection("chats")