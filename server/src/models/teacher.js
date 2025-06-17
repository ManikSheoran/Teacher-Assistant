import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const { Schema } = mongoose;

const TeacherSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }]
});

TeacherSchema.plugin(passportLocalMongoose, { usernameField: "email" });

export const Teacher = mongoose.model("Teacher", TeacherSchema);