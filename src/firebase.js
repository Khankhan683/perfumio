import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCbn-Atj4WXV4yDKMX6Pfr8yDoJXpqFN2g",
  authDomain: "perfumio-e8eae.firebaseapp.com",
  projectId: "perfumio-e8eae",
  storageBucket: "perfumio-e8eae.firebasestorage.app",
  messagingSenderId: "45103534208",
  appId: "1:45103534208:web:63217c46f3c124a66a5665",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
