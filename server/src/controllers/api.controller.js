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
    model: "gemini-2.0-flash",
    systemInstruction: `
        You are a teacher assistant. Evaluate the user's input, provide feedback, and grade it out of the given marks based on the subject and question. Verify factual accuracy for historical or real-life claims. Use the model answer, if provided, for comparison and refer to the marking scheme for grading.  Conclude the feedback clearly by stating: "Out of [Max Marks] - Your Grade is [X]."
    `,
});

const genAIThinker = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-thinking-exp-01-21",
    systemInstruction: ` 
        You are a teacher assistant. Evaluate the user's input, provide feedback, and grade it out of the given marks based on the subject and question. Verify factual accuracy for historical or real-life claims. Use the model answer, if provided, for comparison and refer to the marking scheme for grading.  Conclude the feedback clearly by stating: "Out of [Max Marks] - Your Grade is [X]."
    `,
});


function formatResponseToHTML(responseText) {
    return responseText
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/(?:\r?\n)- (.*?)(?=\r?\n|$)/g, "<li>$1</li>")
        .replace(/\r?\n/g, "<br>");
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
    try {
        if (!req.files['image2']) {
            return res.status(400).send("Student's answer image is required.");
        }

        const { topic, marks } = req.body;
        const sampleQAPath = req.files['image1']?.[0]?.path || null;
        const studentQAPath = req.files['image2'][0].path;

        let sampleText = '';
        if (sampleQAPath) {
            const [sampleResult] = await visionClient.textDetection(sampleQAPath);
            sampleText = sampleResult.fullTextAnnotation?.text || '';
            fs.unlinkSync(sampleQAPath);
        }

        const [studentResult] = await visionClient.textDetection(studentQAPath);
        const studentText = studentResult.fullTextAnnotation?.text || '';
        fs.unlinkSync(studentQAPath);

        if (!studentText) {
            return res.status(400).send("Could not detect text in student's answer.");
        }

        const promptParts = [
            `Topic: ${topic}`,
            sampleText ? `Sample Question and Answer: ${sampleText}` : '',
            `Student Question and Answer: ${studentText}`,
            `Marks: ${marks}`
        ].filter(Boolean).join('; ');

        const evaluationResult = await genAIController.generateContent(promptParts);
        const responseText = evaluationResult.response.text();
        const formattedResponse = formatResponseToHTML(responseText);

        res.status(200).send(formattedResponse);
    } catch (error) {
        console.error("Error detecting text in image:", error);
        res.status(500).send("Error processing images.");
    }
});

const evaluateAnswerWithImages = asyncHandler(async (req, res) => {
    const { sid, topic, marks } = req.body;

    if (!req.files || !req.files['image2']) {
        return res.status(400).send("Student's answer image is required.");
    }

    const sampleQAPath = req.files['image1']?.[0]?.path || null;
    const studentQAPath = req.files['image2'][0].path;

    try {
        let sampleText = '';
        if (sampleQAPath) {
            const [sampleResult] = await visionClient.textDetection(sampleQAPath);
            sampleText = sampleResult.fullTextAnnotation?.text || '';
            fs.unlinkSync(sampleQAPath); // Remove the sample image after processing
        }

        const [studentResult] = await visionClient.textDetection(studentQAPath);
        const studentText = studentResult.fullTextAnnotation?.text || '';
        fs.unlinkSync(studentQAPath); // Remove the student image after processing

        if (!studentText) {
            return res.status(400).send("Could not detect text in student's answer.");
        }

        const promptParts = [
            `Topic: ${topic}`,
            sampleText ? `Sample Question and Answer: ${sampleText}` : '',
            `Student Question and Answer: ${studentText}`,
            `Marks: ${marks}`
        ].filter(Boolean).join('; ');

        // Use the appropriate generative AI model based on the presence of sampleQAPath
        const evaluationResult = sampleQAPath
            ? await genAIController.generateContent(promptParts)
            : await genAIThinker.generateContent(promptParts);

        const responseText = await evaluationResult.response.text();
        const formattedResponse = formatResponseToHTML(responseText);

        const studentDocRef = doc(db, "students", sid);
        const studentDoc = await getDoc(studentDocRef);

        if (!studentDoc.exists()) {
            return res.status(404).send("Student not found.");
        }

        const feedbackData = {
            topic,
            questionAnswerSample: sampleText || null,
            questionAnswerStudent: studentText,
            marks,
            feedback: formattedResponse,
            createdAt: new Date().toISOString(),
        };

        await updateDoc(studentDocRef, {
            feedback: arrayUnion(feedbackData),
        });

        res.status(200).send(formattedResponse);
    } catch (error) {
        console.error("Error evaluating answer with images:", error);
        res.status(500).send("Internal server error during evaluation.");
    }
});

const evaluateAnswerWithoutImages = asyncHandler(async (req, res) => {
    const { sid, topic, question, answer, sampleAnswer, marks } = req.body;

    // Construct the prompt based on whether a sampleAnswer is provided
    const prompt = sampleAnswer
        ? `Topic: ${topic}; Question: ${question}; Sample Answer: ${sampleAnswer}; Answer: ${answer}; Marks: ${marks}`
        : `Topic: ${topic}; Question: ${question}; Answer: ${answer}; Marks: ${marks}`;

    try {
        // Use the appropriate generative AI model
        const evaluationResult = sampleAnswer
            ? await genAIController.generateContent(prompt)
            : await genAIThinker.generateContent(prompt);

        // Retrieve the response text and format it
        const responseText = await evaluationResult.response.text();
        const formattedResponse = formatResponseToHTML(responseText);

        // Retrieve the student's document from Firestore
        const studentDocRef = doc(db, "students", sid);
        const studentDoc = await getDoc(studentDocRef);

        if (!studentDoc.exists()) {
            return res.status(404).send("Student not found");
        }

        // Prepare feedback data
        const feedbackData = {
            topic,
            question,
            answer,
            marks,
            feedback: formattedResponse,
            createdAt: new Date().toISOString(),
        };
        if (sampleAnswer) {
            feedbackData.sampleAnswer = sampleAnswer;
        }

        // Update the student's document with the feedback
        await updateDoc(studentDocRef, {
            feedback: arrayUnion(feedbackData),
        });

        res.status(200).send(formattedResponse);
    } catch (error) {
        console.error("Error evaluating answer:", error);
        res.status(500).send("Error evaluating answer");
    }
});

export { detectTextInImage, evaluateAnswerWithImages, evaluateAnswerWithoutImages, upload };