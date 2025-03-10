﻿# Overburdened Teachers and the Need for Personalized Feedback
Teachers in schools, coaching centres, and colleges often face a heavy workload when providing individualized feedback to students in large classrooms. Manual grading and feedback processes are time-consuming, leaving educators with limited time to focus on teaching and mentoring. This challenge is particularly acute in under-resourced settings, where teacher-to-student ratios are high. As a result, students miss out on personalized guidance, which is critical for their academic growth and success.<br>

## Objective:
Participants are tasked with creating an AI-powered teacher assistant that automates the grading of assignments and provides personalized feedback to students. The solution should enhance the teaching process by reducing the burden on educators, improving the quality of feedback, and enabling personalized learning experiences. Your solution should align with UN SDG 4: Quality Education, which aims to ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.  

---
# AI-Powered Teacher Assistant

## Project Overview
This project builds an AI-powered teacher assistant that automates assignment grading and provides personalized feedback to students. Designed using the MERN stack and leveraging Google technologies (including Gemini API and Google Classroom API), the solution aims to reduce teacher workload and enhance the overall learning experience.

## Features
- **Automated Grading:**  
  - Objective questions (MCQs, true/false) graded instantly.
  - Subjective answer evaluation using Gemini API.
- **Personalized Feedback:**  
  - AI-generated feedback including recommendations.
- **Google Classroom Integration:**  
  - Sync and fetch assignments from Google Classroom.
- **User Interfaces:**  
  - Teacher dashboard to view and manage assignments.
  - Student dashboard for submission and feedback review.
- **Plagiarism Detection:**  
  - Basic logic to detect similar content using TF-IDF/cosine similarity.
  
## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js with Express.js
- **Database:** MongoDB
- **AI & NLP:** Gemini API
- **Authentication:** Google OAuth 2.0
- **Deployment:** Google Cloud Platform

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB instance (local/cloud)
- Google Cloud Platform account with access to Gemini API and Google Classroom API
- Git and GitHub for collaboration

### Installation
1. **Clone the repository:**
```git clone https://github.com/ManikSheoran/Teacher-Assistant/```
# Project Structure
- `/client` - React frontend code.
- `/server` - Node.js backend code.
- `/models` - Database models and schemas.
- `/controllers` - API controller functions.
- `/routes` - API endpoints.
- `/utils` - Utility modules and helpers.

## 30-Day Roadmap & GitHub Project Todos

Below is the daily breakdown of tasks for each team member (M1, M2, M3, M4). Each bullet corresponds to a GitHub Issue/task to be added to your project board (using columns like "To Do", "In Progress", "Review", "Done").

### Week 1: Setup and Initial Development

#### Day 1: Project Initialization
- **M1:** Create GitHub repository and set up the project board (Kanban style).
- **M2:** Initialize Node.js project with Express.js; set up the basic folder structure for the backend.
- **M3:** Initialize React.js project with create-react-app; set up basic folder structure.
- **M4:** Research and document Gemini API and Google Classroom API integration steps.

#### Day 2: Environment Setup
- **M1:** Set up MongoDB (local or cloud) and create a basic user schema.
- **M2:** Implement Google OAuth 2.0 authentication on the backend.
- **M3:** Create basic React components for login and dashboard layout.
- **M4:** Test and verify Gemini API integration with a simple sample request.

#### Day 3: Backend Foundation
- **M1:** Configure Express.js routes for user authentication and assignment management.
- **M2:** Develop middleware for authentication using Google OAuth tokens.
- **M3:** Design and code the frontend login page and connect it to backend authentication APIs.
- **M4:** Write and run basic tests for backend APIs (using Postman or similar).

#### Day 4: Frontend Foundation
- **M1:** Develop MongoDB schema for storing assignments and submissions.
- **M2:** Build API endpoints for CRUD operations on assignments.
- **M3:** Create a React component for the teacher dashboard showing an assignment list.
- **M4:** Test the backend routes to ensure proper database connectivity.

#### Day 5: Google Classroom Integration
- **M1:** Explore Google Classroom API endpoints for fetching assignments.
- **M2:** Implement backend integration to fetch assignments from Google Classroom.
- **M3:** Add a sync button in the teacher dashboard for Google Classroom integration.
- **M4:** Perform end-to-end testing for Google Classroom integration (backend and frontend).

#### Day 6: Grading System Setup
- **M1:** Develop an API endpoint for receiving student assignment submissions.
- **M2:** Create a function on the backend for grading objective questions (MCQs, true/false).
- **M3:** Design a React component for students to submit assignments.
- **M4:** Integrate the Gemini API into the backend to evaluate subjective answers.

#### Day 7: Week 1 Review
- **All Members:**  
- Perform integrated testing of login, assignment creation, grading, etc.
- Identify and document bugs; assign fixes.
- Hold a short review meeting to plan tasks for Week 2.

### Week 2: Core Feature Development

#### Day 8: Feedback System
- **M1:** Extend database schema to store feedback for student submissions.
- **M2:** Create an API endpoint to generate feedback using results from the Gemini API.
- **M3:** Build a new React component for displaying feedback in the student dashboard.
- **M4:** Write logic to generate personalized feedback based on grading outcomes.

#### Days 9–10: Teacher Dashboard Enhancements
- **M1 & M2:**  
- Enhance the teacher dashboard to display grading results.
- Implement sorting and filtering features (e.g., by grade).
- **M3 & M4:**  
- Improve UI/UX design of the teacher dashboard using Material UI or Tailwind CSS.
- Test all dashboard features for usability and responsiveness.

#### Days 11–12: Student Dashboard Development
- **M1 & M2:**  
- Create React components for the student dashboard to view feedback and grades.
- Develop backend endpoint to fetch a student’s grade and feedback data.
- **M3 & M4:**  
- Add functionality for students to request clarification on feedback.
- Perform comprehensive testing of the student dashboard.

#### Days 13–14: Midpoint Review and Bug Fixing
- **All Members:**  
- Conduct a full system test covering teacher and student workflows.
- Document and prioritize bug fixes.
- Optimize performance of both APIs and UI components.
- Update the project board and reassign tasks as needed.

### Weeks 3 & 4: Refinement, Testing, and Deployment

#### Day 15: Backend Optimization & Advanced Grading Logic
- **M1:** Optimize backend APIs for performance.
- **M2:** Enhance grading logic for more dynamic evaluation.
- **M3:** Improve UI responsiveness in the teacher dashboard.
- **M4:** Test Gemini API integration under various conditions.

#### Day 16: Error Handling and Resilience
- **M1:** Implement robust error handling in API endpoints.
- **M2:** Incorporate retry logic for Gemini API requests.
- **M3:** Finalize all revisions for the teacher dashboard UI.
- **M4:** Write unit tests for grading functions and overall integration.

#### Day 17: Real-Time Updates and Testing
- **M1:** Integrate real-time updates using WebSockets/Socket.IO for grading notifications.
- **M2:** Optimize database queries for scalability.
- **M3:** Finalize and polish the student dashboard UI.
- **M4:** Perform cross-browser testing to ensure compatibility.

#### Days 18–19: Deployment Preparations and CI/CD Setup
- **M1:** Prepare deployment scripts (consider Docker, GCP deployment configs).
- **M2:** Set up CI/CD pipeline using GitHub Actions.
- **M3:** Document frontend component usage and structure.
- **M4:** Document backend API endpoints and integration guides.

#### Days 20–21: Initial Deployment and Load Testing
- **M1 & M3:** Deploy the MVP on Google Cloud Platform (App Engine/Compute Engine).
- **M2:** Perform load testing and monitor performance metrics.
- **M4:** Update the README with deployment instructions and screenshots.

#### Days 22–23: User Feedback Collection and Bug Fixes
- **M1:** Organize a feedback session with pilot users (teachers and students).
- **M2:** Address and fix bugs based on user feedback.
- **M3:** Refine UI/UX for both dashboards.
- **M4:** Optimize the quality of AI-generated feedback.

#### Days 24–25: Final Feature Refinement and Presentation Prep
- **M1:** Finalize all backend features after user testing.
- **M2:** Update and polish the README and other documentation.
- **M3:** Conduct final system-wide testing and implement bug fixes.
- **M4:** Prepare presentation slides and record a demo video.

#### Days 26–27: Plagiarism Detection and Final Testing
- **M1:** Integrate plagiarism detection logic into the grading system.
- **M2:** Ensure plagiarism results display correctly on both teacher and student dashboards.
- **M3:** Perform full integration testing of all new features.
- **M4:** Work on final QA checks and document remaining minor issues.

#### Days 28–29: Final Team Review and Pre-Deployment Checks
- **All Members:**  
- Hold a retrospective meeting and finalize outstanding tasks.
- Ensure all issues on the project board are resolved or documented.
- Test deployment readiness and perform a final code review.

#### Day 30: Deployment and Project Wrap-Up
- **M1 & M3:** Deploy the final version of the MVP to production on GCP.
- **M2 & M4:** Finalize user and technical documentation; update the README.
- **All Members:**  
- Review the project performance.
- Celebrate the successful launch and capture lessons learned.

## Contributing
1. Fork and clone the repository.
2. Create a feature branch before making changes.
3. Make atomic commits and reference issues where applicable.
4. Open a pull request with detailed descriptions of your changes.
5. Follow our coding style guidelines.

## License
This project is distributed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments
- Thanks to Google for their technologies (Gemini API, Google Classroom).
- Appreciation to our mentors and supporters.

