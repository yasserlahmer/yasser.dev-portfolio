// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// TODO: Replace with your actual Firebase project configuration
// You can get this from the Firebase Console: Project settings -> General -> Your apps
const firebaseConfig = {
    apiKey: "AIzaSyBKbUK1jqzwVMYm-o0RWbpYDOToDNx-Ykg",
    authDomain: "nexttrip-1aefb.firebaseapp.com",
    projectId: "nexttrip-1aefb",
    storageBucket: "nexttrip-1aefb.firebasestorage.app",
    messagingSenderId: "600552605612",
    appId: "1:600552605612:web:56020f29de724a5f05dc09",
    measurementId: "G-MVRS1QR5MM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
