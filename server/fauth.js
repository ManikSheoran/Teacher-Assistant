import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import {
    getAuth,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
} from "firebase/auth";

dotenv.config(
    {
        path: "./.env",
    }
);

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

const auth = getAuth(app)

const usersCollection = collection(db, "users")

const email = "frerbv@gognero.ebe"
const password = "password"

async function registerUser(email, username, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        const userDocRef = doc(usersCollection, user.uid)
        console.log(userDocRef)
        await setDoc(userDocRef, {
            email: email,
            username: username,
            born: 1815,
        })
    } catch (e) {
        console.error(e)
    }
}

registerUser(email, "abcdefghijkl", password)

// await signInWithEmailAndPassword(auth, email, password)
// .then((userCredential) => {
//     // Signed in
//     const user = userCredential.user;
//     console.log(user.displayName)
//     // ...
// })
// .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     console.log(errorCode, errorMessage);
//     // ..
// })
