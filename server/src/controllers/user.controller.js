import { initializeApp } from "firebase/app";
import {
    collection,
    doc,
    getFirestore,
    setDoc,
    getDoc,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import asyncHandler from "../utils/asyncHandler.js";
import { log } from "console";

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

    // Determine environment
    const isProduction = true;

    // Configure cookie options appropriately
    const cookieOptions = {
        maxAge: token.expiresIn,
        httpOnly: true,
        secure: false, // True in production, false in development
        sameSite: "lax" // Use appropriate SameSite policy
    };

    res.cookie("token", token.accessToken, cookieOptions)
    res.cookie("uid", user.uid, cookieOptions)
    res.status(200).json({ message: "Login successful" });
});

const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("token");
    res.clearCookie("uid");
    res.status(200).json({ message: "Logout successful" });
});

const fetchUser = asyncHandler(async (req, res) => {
    const user = await getDoc(doc(usersCollection, req.body.uid));
    res.status(200).send(user.data());
});

const fetchUserData = asyncHandler(async (req, res) => {
    const userUID = req.cookies.uid; // ✅ Read UID from cookies

    if (!userUID) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const user = await getDoc(doc(usersCollection, userUID)); // ✅ Fetch user from DB
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res
        .status(200)
        .json(
        {
            name: user.data().name,
        });

    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Server error" });
    }
});

const fetchUserUID = asyncHandler(async (req, res) => {
    const userUID = req.cookies.uid;
    if (!userUID) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    return res.json({ uid: userUID });
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
    const userId = req.cookies.uid;
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

const validateUser = asyncHandler(async (req, res) => {
    const { uid } = req.body;
    if (!uid) {
        return res.status(400).send("UID is required");
    }

    const userDocRef = doc(usersCollection, uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        return res.status(404).send("User not found");
    }

    res.status(200).send("User found");
});

export {
    registerUser,
    loginUser,
    fetchUserData,
    addStudent,
    getStudentList,
    getFeedbacks,
    validateUser,
    fetchUserUID,
    logoutUser
};
