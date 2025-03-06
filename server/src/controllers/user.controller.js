import { initializeApp } from "firebase/app";
import { collection, doc, getFirestore, setDoc, getDoc } from "firebase/firestore";
import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
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
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const usersCollection = collection(db, "users")

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    const userDocRef = doc(usersCollection, user.uid)
    await setDoc(userDocRef, {
        email: email,
        name: name,

    })
    res.status(201).send("User registered successfully")
})

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    const token = {
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        expiresIn: user.stsTokenManager.expirationTime,
    };
    res.status(200).send({ uid: user.uid, token });
})

const fetchUser = asyncHandler(async (req, res) => {
    const user = await getDoc(doc(usersCollection, req.body.uid))
    res.status(200).send(user.data())
})

const addStudent = asyncHandler(async (req, res) => {
    const {userId, name, sid} = req.body
    const studentDoc = doc(studentsCollection);
    await setDoc(studentDoc, {
        name: name,
        id: sid,
    })

    const userDocRef = doc(usersCollection, userId)
    await updateDoc(userDocRef, {
        students: arrayUnion({ name: name, email: email })
    })
    
    res.status(201).send("Student added successfully")
})

export { registerUser, loginUser, fetchUser }
