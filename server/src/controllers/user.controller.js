import mongoose from "mongoose";
import { Student } from "../models/student.js";
import { Teacher } from "../models/teacher.js";
import asyncHandler from "../utils/asyncHandler.js";

// STUDENT REGISTER
const registerStudent = asyncHandler(async (req, res) => {
    const { name, email, password, roll } = req.body; 
    const existing = await Student.findOne({ email });
    if (existing) {
        return res.status(400).json({ error: "Student already exists" });
    }
    Student.register(new Student({ name, email, roll, feedback: [] }), password, (err, student) => { 
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).send("Student registered successfully");
    });
});

// TEACHER REGISTER
const registerTeacher = asyncHandler(async (req, res) => {
    const { name, email, password, subject } = req.body;
    const existing = await Teacher.findOne({ email });
    if (existing) {
        return res.status(400).json({ error: "Teacher already exists" });
    }
    Teacher.register(new Teacher({ name, email, subject, students: [] }), password, (err, teacher) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).send("Teacher registered successfully");
    });
});

// STUDENT LOGIN
const loginStudent = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    Student.authenticate()(email, password, (err, student, options) => {
        if (err || !student) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        res.cookie("student_id", student._id.toString(), {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: "Student login successful" });
    });
});

// TEACHER LOGIN
const loginTeacher = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    Teacher.authenticate()(email, password, (err, teacher, options) => {
        if (err || !teacher) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        res.cookie("teacher_id", teacher._id.toString(), {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: "Teacher login successful" });
    });
});

// LOGOUT (for both)
const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("student_id");
    res.clearCookie("teacher_id");
    res.status(200).json({ message: "Logout successful" });
});

// FETCH STUDENT DATA
const fetchStudentData = asyncHandler(async (req, res) => {
    const studentId = req.cookies.student_id;
    if (!studentId) return res.status(401).json({ error: "Unauthorized" });
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.status(200).json({ name: student.name, email: student.email, roll: student.roll, feedback: student.feedback }); 
});

// FETCH TEACHER DATA
const fetchTeacherData = asyncHandler(async (req, res) => {
    const teacherId = req.cookies.teacher_id;
    if (!teacherId) return res.status(401).json({ error: "Unauthorized" });
    const teacher = await Teacher.findById(teacherId).populate("students");
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });
    res.status(200).json({ name: teacher.name, email: teacher.email, students: teacher.students });
});

// TEACHER: ADD STUDENT
const addStudentToTeacher = asyncHandler(async (req, res) => {
    const teacherId = req.cookies.teacher_id;
    const { name, email, roll } = req.body; 
    if (!teacherId) return res.status(401).json({ error: "Unauthorized" });

    const existing = await Student.findOne({ email });
    if (existing) {
        return res.status(400).json({ error: "Student already exists" });
    }
    const student = new Student({ name, email, roll, feedback: [] }); 
    await student.save();

    // Add to teacher's students
    const teacher = await Teacher.findById(teacherId);
    teacher.students.push(student._id);
    await teacher.save();

    res.status(201).send("Student added to teacher successfully");
});

// TEACHER: GET STUDENT LIST
const getTeacherStudentList = asyncHandler(async (req, res) => {
    const teacherId = req.cookies.teacher_id;
    if (!teacherId) return res.status(401).json({ error: "Unauthorized" });
    const teacher = await Teacher.findById(teacherId).populate("students");
    if (!teacher) return res.status(404).send("Teacher not found");
    res.status(200).send(teacher.students);
});

// STUDENT: GET FEEDBACKS
const getStudentFeedbacks = asyncHandler(async (req, res) => {
    const {sid} = req.body;
    const student = await Student.findOne({ roll: sid });
    if (!student) return res.status(404).send("Student not found");
    res.status(200).send(student.feedback);
});

// VALIDATE USER
const validate = asyncHandler(async (req, res) => {
    if (req.cookies.student_id || req.cookies.teacher_id) {
        return res.status(200).json({ valid: true });
    }
    res.status(401).json({ valid: false });
});

export {
    registerStudent,
    registerTeacher,
    loginStudent,
    loginTeacher,
    logoutUser,
    fetchStudentData,
    fetchTeacherData,
    addStudentToTeacher,
    getTeacherStudentList,
    getStudentFeedbacks,
    validate
};
