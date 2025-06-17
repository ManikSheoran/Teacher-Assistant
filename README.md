# Overburdened Teachers and the Need for Personalized Feedback
Teachers in schools, coaching centres, and colleges often face a heavy workload when providing individualized feedback to students in large classrooms. Manual grading and feedback processes are time-consuming, leaving educators with limited time to focus on teaching and mentoring. This challenge is particularly acute in under-resourced settings, where teacher-to-student ratios are high. As a result, students miss out on personalized guidance, which is critical for their academic growth and success.<br>

## Objective:
Participants are tasked with creating an AI-powered teacher assistant that automates the grading of assignments and provides personalized feedback to students. The solution should enhance the teaching process by reducing the burden on educators, improving the quality of feedback, and enabling personalized learning experiences. Your solution should align with UN SDG 4: Quality Education, which aims to ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.  

---
# NeuroGrade

NeuroGrade is an AI-powered teacher assistant that automates grading and provides personalized feedback. It supports both structured and open-ended questions, including handwritten responses.

## 🚀 Features

- **Hybrid AI Model**: Utilizes **Google Gemini API 2.0 Flash & Thinking** for structured and open-ended question evaluation.
- **Handwritten Answer Support**: Uses **Vision API for OCR-based evaluation** of handwritten responses.
- **Teacher-Specific Customization**: Allows institutions to train the AI model on past assessments using **Google AI Studio**.
- **Scalable & Secure**: Built using **Next.js (Frontend), Express.js & MongoDB (Backend)** for high efficiency and performance.
- **Affordable & Inclusive**: Designed for **small home tutors to large institutions**, making AI-driven grading accessible.
- **UN SDG Alignment**:
  - **SDG 4 (Quality Education)**: Enhances personalized learning and feedback.
  - **SDG 9 (Industry, Innovation, and Infrastructure)**: Uses AI to modernize education.
  - **SDG 10 (Reduced Inequalities)**: Ensures accessibility for diverse learning environments.

## 📌 Problem Statement

Teachers face **heavy workloads** in grading assignments and providing individualized feedback, particularly in **large classrooms** or **under-resourced schools**. This leads to reduced teaching time and limits personalized guidance for students.

## 🎯 Objective

NeuroGrade aims to:
- **Automate grading** of assignments to save teachers’ time.
- **Provide personalized feedback** to enhance student learning.
- **Reduce workload** for educators while maintaining feedback quality.

## 🛠️ Tech Stack

- **Frontend**: Next.js (React Framework)
- **Backend**: Node.js (Express.js), MongoDB
- **AI Processing**: Google AI Studio, Google Gemini API 2.0
- **Database**: Firestore
- **OCR for Handwritten Responses**: Google Vision API

## 🔑 Core Functionality

### Faculty Registration & Dashboard
- Secure authentication via **Passport.js** and **MongoDB**
- Dashboard to **add students, view history, and evaluate assignments**

### Evaluation Process
1. Teachers enter **Student ID, Assignment Title, and Max Marks**.
2. Upload **typed or handwritten** student responses.
3. **AI Model** evaluates answers and provides:
   - **Constructive feedback**
   - **Grading with explanations**
   - **Feedback history storage for student progress tracking**

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```sh
  git clone https://github.com/ManikSheoran/Teacher-Assistant.git
```

### 2️⃣ Install Dependencies
```sh
  npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and configure:
```sh
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_api_key
VISION_API_KEY=your_api_key
```

### 4️⃣ Start the Development Server
```sh
  npm run dev
```

## 📜 License

NeuroGrade is licensed under the **MIT License**.

## 🤝 Contributing

Contributions are welcome! Please open an **issue** or submit a **pull request**.

## 📞 Contact
For queries or collaborations, reach out via **GitHub Issues** or email us at **contact@neurograde.app**.

---
Developed with ❤️ by **Team Bit-Z**
