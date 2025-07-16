# Doubt Solver Agent


## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create a `.env` file in the root directory and add your Gemini API key:**
   ```
   GEMINI_API_KEY=your_api_key_here
   MONGO_URI = "mongodb://localhost:27017"
   ```
4. **Paste Google Oauth2 file as `client_secret.json` and `token.json` in the root directory (Required while  Google Meet Creation)**

5. **Run the application locally:**
   ```bash
   uvicorn main:app --reload --port 5000
   ```

6. **Access the application at** `http://localhost:5000`

## Project Structure

```
.
├── README.md
├── requirements.txt
├── .env
├── main.py
├── src/
│   ├── db.py
│   ├── chat.py
│   ├── crud.py
│   ├── meet.py
│   └── models.py
```

## API Endpoints

- `POST /api/query`: Submit a question to the tutoring system
  - Request body: `{"query": "your question here"}`
  - Response: `{"response": "system's response"}`

## MongoDB Initialization

To use this application, you must have MongoDB running locally. Follow these steps to ensure MongoDB is set up correctly:

1. **Install MongoDB**
   - Download and install MongoDB Community Edition from: https://www.mongodb.com/try/download/community
   - Follow the installation instructions for your operating system.

2. **Start the MongoDB server**
   - On most systems, you can start MongoDB with:
     ```bash
     mongod
     ```
   - By default, MongoDB will run on `mongodb://localhost:27017`.

3. **Automatic Collection Creation**
   - When you start the FastAPI server, the application will automatically check for and create the following collections if they do not exist:
     - `teachers`
     - `students`
     - `chats`
   - This logic is handled in `src/db.py`.

4. **Verify Connection**
   - Ensure your MongoDB server is running **before** starting the FastAPI server. If MongoDB is not running, the application will not be able to connect to the database.

If you need to change the MongoDB connection URI, update the `MONGO_DETAILS` variable in `src/db.py`. 