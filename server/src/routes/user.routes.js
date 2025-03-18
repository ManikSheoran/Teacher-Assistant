import express from "express"
import {
    loginUser,
    registerUser,
    addStudent,
    getStudentList,
    getFeedbacks,
    validateUser,
    fetchUserUID,
    fetchUserData,
    logoutUser,
} from "../controllers/user.controller.js";

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logoutUser)
router.get("/fetch", fetchUserData)
router.post("/addstudent", addStudent)
router.get("/:userId/studentlist", getStudentList)
router.get("/:sid/feedbacks", getFeedbacks)
router.get("/fetchuid", fetchUserUID)
router.post("/:sid/validate", validateUser)

export default router