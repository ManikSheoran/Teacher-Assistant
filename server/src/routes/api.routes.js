import { Router } from "express";
import multer from "multer";
import { detectTextInImage, evaluateAnswer } from "../controllers/api.controller.js";

const router = Router();
const upload = multer({ dest: 'uploads/' }); 

router.route("/ocr").post(upload.single('imageFile'), detectTextInImage);
router.route("/evaluate").post(evaluateAnswer);

export default router;