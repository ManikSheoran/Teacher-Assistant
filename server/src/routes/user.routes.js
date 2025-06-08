import express from "express"
import {
    registerStudent,
    registerTeacher,
    loginStudent,
    loginTeacher,
    logoutUser,
    fetchStudentData,
    fetchTeacherData,
    addStudentToTeacher,
    getTeacherStudentList,
    getStudentFeedbacks,
    validate
} from "../controllers/user.controller.js";

const router = express.Router()

// Student routes
router.post("/student/register", registerStudent)
router.post("/student/login", loginStudent)
router.get("/student/data", fetchStudentData)
router.post("/student/feedbacks", getStudentFeedbacks)

// Teacher routes
router.post("/teacher/register", registerTeacher)
router.post("/teacher/login", loginTeacher)
router.get("/teacher/data", fetchTeacherData)
router.post("/teacher/add-student", addStudentToTeacher)
router.get("/teacher/students", getTeacherStudentList)
router.get("/validate", validate)
router.post("/logout", logoutUser)

export default router