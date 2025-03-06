import express from "express"
import { loginUser, registerUser, fetchUser, addStudent } from "../controllers/user.controller.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/fetch", fetchUser)
router.post("/addstudent", addStudent)

export default router