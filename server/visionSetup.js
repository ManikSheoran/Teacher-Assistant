import { ImageAnnotatorClient } from "@google-cloud/vision"
import dotenv from "dotenv"

dotenv.config(
    {
        path: "./.env"
    }
)
const config = {
    credentials: {
        private_key: process.env.VISION_API_PRIVATE_KEY,
        client_email: process.env.VISION_API_CLIENT_EMAIL,
    },
}

const client = new ImageAnnotatorClient(config);

async function detectTextInImage(imagePath) {
    const [result] = await client.textDetection(imagePath)
    return result.fullTextAnnotation.text
}

const imagePath = "./Screenshot.png"
const data = detectTextInImage(imagePath)
    .then((text) => console.log(text))
    .catch((err) => console.error(err))

console.log("Text detected in image:")
console.log(data.text)
