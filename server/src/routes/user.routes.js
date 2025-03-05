import express from "express"
import { loginUser, registerUser, fetchUser } from "../controllers/user.controller.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/fetch", fetchUser)

export default router