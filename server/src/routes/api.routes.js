import express from 'express';
import { detectTextInImage, evaluateAnswer, upload } from '../controllers/api.controller.js';

const router = express.Router();

router.post('/ocr', upload.single('image'), detectTextInImage);
router.post('/evaluate', evaluateAnswer);
router.post("/:sid/evaluate", evaluateAnswer);

export default router;