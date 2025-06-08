import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const { Schema } = mongoose;

const FeedbackSchema = new Schema({
    topic: String,
    question: String,
    answer: String,
    sampleAnswer: String,
    questionAnswerSample: String,
    questionAnswerStudent: String,
    marks: Number,
    feedback: String,
    createdAt: { type: Date, default: Date.now }
});

const StudentSchema = new Schema({
    email: { type: String, required: true, unique: true },
    name: String,
    roll: { type: String, required: true, unique: true },
    feedback: [FeedbackSchema]
});

StudentSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

export const Student = mongoose.model("Student", StudentSchema);