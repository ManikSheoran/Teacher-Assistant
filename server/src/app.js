import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

dotenv.config({
    path: "./.env"
});

const app = express();

const corsOptions = {
    origin: ["https://www.neurograde.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
    credentials: true,
};

app.use(cookieParser())
app.use(cors(corsOptions));
app.use(bodyParser.json());

import apiRouter from "./routes/api.routes.js"
import userRouter from "./routes/user.routes.js"

app.use("/api/v1", apiRouter)
app.use("/user", userRouter)

export default app