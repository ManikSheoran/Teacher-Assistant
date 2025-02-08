import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
});

const app = express();

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

import router from "./routes/api.routes.js"

app.use("/api/v1", router)

export default app