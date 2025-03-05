import { initializeApp } from "firebase/app";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from "firebase/auth";
import asyncHandler from "../utils/asyncHandler";

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
    res.status(200).send(user)
})

export { registerUser, loginUser }
