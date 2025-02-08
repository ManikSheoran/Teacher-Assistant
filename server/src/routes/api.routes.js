import { Router } from "express"
import { detectTextInImage, evaluateAnswer } from "../controllers/api.controller.js"

const router = Router()

router.route("/ocr").post(detectTextInImage)
router.route("/evaluate").post(evaluateAnswer)

export default router