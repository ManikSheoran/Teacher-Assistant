import asyncHandler from "../utils/asyncHandler.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const visionClient = new ImageAnnotatorClient({
    credentials: {
        private_key: process.env.VISION_API_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.VISION_API_CLIENT_EMAIL,
    },
});

const genAIController = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
    You are a teacher assistant. Evaluate the user's input, provide feedback, and grade them out of the marks given and based on the subject and question. Also check the fact claims in history or real life related answers.`,
});

function formatResponseToHTML(responseText) {
    return responseText
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n\* (.*?)\n/g, "<ul><li>$1</li></ul>")
        .replace(/\n\* (.*?)/g, "<li>$1</li>")
        .replace(/\n/g, "<br>");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

const detectTextInImage = asyncHandler(async (req, res) => {
    const { title, topic, marks } = req.body;
    const modelAnswerPath = req.files['image1'][0].path;
    const imagePath = req.files['image2'][0].path;

    try {
        const [modelResult] = await visionClient.textDetection(modelAnswerPath);
        const modelText = modelResult.fullTextAnnotation.text;
        const [result] = await visionClient.textDetection(imagePath);
        const text = result.fullTextAnnotation.text;
        fs.unlinkSync(modelAnswerPath);
        fs.unlinkSync(imagePath);

        const prompt = `Title: ${title} Topic: ${topic}; Sample Answer: ${modelText}; Question and Answer: ${text}; Marks: ${marks}`;
        const evaluationResult = await genAIController.generateContent(prompt);
        const responseText = evaluationResult.response.text();
        const formattedResponse = formatResponseToHTML(responseText);

        res.status(200).send(formattedResponse);
    } catch (error) {
        console.error("Error detecting text in image:", error);
        res.status(500).send("Error processing images");
    }
});

const evaluateAnswerWithImages = asyncHandler(async (req, res) => {
    const { sid, topic, marks } = req.body;
    const modelAnswerPath = req.files['image1'] ? req.files['image1'][0].path : null;
    const imagePath = req.files['image2'][0].path;

    try {
        let modelText = '';
        if (modelAnswerPath) {
            const [modelResult] = await visionClient.textDetection(modelAnswerPath);
            modelText = modelResult.fullTextAnnotation.text;
            fs.unlinkSync(modelAnswerPath);
        }

        const [result] = await visionClient.textDetection(imagePath);
        const text = result.fullTextAnnotation.text;
        fs.unlinkSync(imagePath);

        const prompt = modelText
            ? `Topic: ${topic}; Sample Answer: ${modelText}; Question and Answer: ${text}; Marks: ${marks}`
            : `Topic: ${topic}; Question and Answer: ${text}; Marks: ${marks}`;
        const evaluationResult = await genAIController.generateContent(prompt);
        const responseText = evaluationResult.response.text();
        const formattedResponse = formatResponseToHTML(responseText);

        // Retrieve the student's document from Firestore
        const studentDocRef = doc(db, "students", sid);
        const studentDoc = await getDoc(studentDocRef);

        if (!studentDoc.exists()) {
            return res.status(404).send("Student not found");
        }

        // Add the feedback to the student's document
        await updateDoc(studentDocRef, {
            feedback: arrayUnion({
                topic: topic,
                question: text,
                answer: modelText,
                marks: marks,
                feedback: formattedResponse,
            }),
        });

        res.status(200).send(formattedResponse);
    } catch (error) {
        console.error("Error evaluating answer:", error);
        res.status(500).send("Error evaluating answer");
    }
});

const evaluateAnswerWithoutImages = asyncHandler(async (req, res) => {
    const { sid, topic, question, answer, marks } = req.body;
    const prompt = `Topic: ${topic}; Question: ${question}; Answer: ${answer}; Marks: ${marks}`;

    try {
        const result = await genAIController.generateContent(prompt);
        const responseText = result.response.text();
        const formattedResponse = formatResponseToHTML(responseText);

        // Retrieve the student's document from Firestore
        const studentDocRef = doc(db, "students", sid);
        const studentDoc = await getDoc(studentDocRef);

        if (!studentDoc.exists()) {
            return res.status(404).send("Student not found");
        }

        // Add the feedback to the student's document
        await updateDoc(studentDocRef, {
            feedback: arrayUnion({
                topic: topic,
                question: question,
                answer: answer,
                marks: marks,
                feedback: formattedResponse,
            }),
        });

        res.status(200).send(formattedResponse);
    } catch (error) {
        console.error("Error evaluating answer:", error);
        res.status(500).send("Error evaluating answer");
    }
});

export { detectTextInImage, evaluateAnswerWithImages, evaluateAnswerWithoutImages, upload };