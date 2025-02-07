import { ImageAnnotatorClient } from "@google-cloud/vision";

const config = {
    credentials: {
        private_key: process.env.VISION_API_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.VISION_API_CLIENT_EMAIL,
    },
};
