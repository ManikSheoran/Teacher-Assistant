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
    //origin: "https://www.neurograde.app",
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser())

import apiRouter from "./routes/api.routes.js"
import userRouter from "./routes/user.routes.js"

app.use("/api/v1", apiRouter)
app.use("/user", userRouter)

export default app