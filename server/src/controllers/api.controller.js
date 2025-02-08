import asyncHandler from "../utils/asyncHandler.js"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { ImageAnnotatorClient } from "@google-cloud/vision"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const visionClient = new ImageAnnotatorClient({
    credentials: {
        private_key: process.env.VISION_API_PRIVATE_KEY,
        client_email: process.env.VISION_API_CLIENT_EMAIL,
    },
})

const genAIController = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
    You are a teacher assistant. Evaluate the user's input, provide feedback, and grade them out of the marks given and based on the subject and question. Also check the fact claims in history or real life related answers.`,
})

function formatResponseToHTML(responseText) {
    return responseText
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n\* (.*?)\n/g, "<ul><li>$1</li></ul>")
        .replace(/\n\* (.*?)/g, "<li>$1</li>");
}

const detectTextInImage = asyncHandler(async (req, res) => {
    const { imagePath } = req.body
    const [result] = await visionClient.textDetection(imagePath)
    const text = result.fullTextAnnotation.text
    res.status(200).json({ text })
})

const evaluateAnswer = asyncHandler(async (req, res) => {
    const { topic, question, answer, marks } = req.body
    const prompt = `Topic: ${topic}; Question: ${question}; Answer: ${answer}; Marks: ${marks}`
    const result = await genAIController.generateContent(prompt)
    const responseText = result.response.text()
    const formattedResponse = formatResponseToHTML(responseText)
    res.status(200).send(formattedResponse)
})

export { detectTextInImage, evaluateAnswer }