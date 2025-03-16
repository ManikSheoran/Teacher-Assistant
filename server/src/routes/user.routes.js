import express from "express"
import { loginUser, registerUser, fetchUser, addStudent, getStudentList, getFeedbacks, validateUser } from "../controllers/user.controller.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/fetch", fetchUser)
router.post("/addstudent", addStudent)
router.get("/:userId/studentlist", getStudentList)
router.get("/:sid/feedbacks", getFeedbacks)
router.post("/:sid/validate", validateUser)

export default router