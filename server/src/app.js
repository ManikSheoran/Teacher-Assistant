import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import helmet from "helmet";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "./config/passport.js";

dotenv.config({
    path: "./.env"
});

const app = express();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});

const corsOptions = {
    origin: ["https://www.neurograde.app", "https://neurograde.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
    credentials: true,
};

app.use(helmet());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET || "my-super-secret-key",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions"
        }),
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

import apiRouter from "./routes/api.routes.js";
import userRouter from "./routes/user.routes.js";

app.use("/api/v1", apiRouter);
app.use("/user", userRouter);

export default app;