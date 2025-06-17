import express from 'express';
import { detectTextInImage, evaluateAnswerWithImages, evaluateAnswerWithoutImages, upload } from '../controllers/api.controller.js';

const router = express.Router();

router.post('/ocr', upload.fields([{ name: 'image1' }, { name: 'image2' }]), detectTextInImage);

router.post('/evaluate', evaluateAnswerWithoutImages);

router.post('/evaluate-with-images', upload.fields([{ name: 'image1' }, { name: 'image2' }]), evaluateAnswerWithImages);

export default router;