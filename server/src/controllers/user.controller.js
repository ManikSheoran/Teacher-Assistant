import { initializeApp } from "firebase/app";
import {
    collection,
    doc,
    getFirestore,
    setDoc,
    getDoc,
    updateDoc,
    arrayUnion
} from "firebase/firestore";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import asyncHandler from "../utils/asyncHandler.js";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const usersCollection = collection(db, "users");
const studentsCollection = collection(db, "students");

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
    const user = userCredential.user;
    const userDocRef = doc(usersCollection, user.uid);
    await setDoc(userDocRef, {
        email: email,
        name: name,
        students: [],
    });
    res.status(201).send("User registered successfully");
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );
    const user = userCredential.user;
    const token = {
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        expiresIn: user.stsTokenManager.expirationTime,
    };
    res.status(200).send({ uid: user.uid, token });
});

const fetchUser = asyncHandler(async (req, res) => {
    const user = await getDoc(doc(usersCollection, req.body.uid));
    res.status(200).send(user.data());
});

const addStudent = asyncHandler(async (req, res) => {
    const { userId, name, sid } = req.body;
    const studentDoc = doc(studentsCollection, sid);
    await setDoc(studentDoc, {
        name: name,
        id: sid,
        feedback: [],
    });

    const userDocRef = doc(usersCollection, userId);
    const userData = await getDoc(userDocRef);
    const currentStudents = userData.data().students || [];
    await updateDoc(userDocRef, {
        students: [...currentStudents, { id: sid }],
    });

    res.status(201).send("Student added successfully");
});

const getStudentList = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const userDocRef = doc(usersCollection, userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        return res.status(404).send("User not found");
    }

    const userData = userDoc.data();
    const studentList = userData.students || [];

    res.status(200).send(studentList);
});

const getFeedbacks = asyncHandler(async (req, res) => {
    const { sid } = req.params;
    const studentDocRef = doc(studentsCollection, sid);
    const studentDoc = await getDoc(studentDocRef);

    if (!studentDoc.exists()) {
        return res.status(404).send("Student not found");
    }

    const studentData = studentDoc.data();
    const feedbackList = studentData.feedback || [];

    res.status(200).send(feedbackList);
});

export { registerUser, loginUser, fetchUser, addStudent, getStudentList, getFeedbacks };
