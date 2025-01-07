// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDShUC2pZk3RvqXge2ZbXwSpZPGpesIZEc",
  authDomain: "booktraveljournalapp.firebaseapp.com",
  projectId: "booktraveljournalapp",
  storageBucket: "booktraveljournalapp.firebasestorage.app",
  messagingSenderId: "444075822437",
  appId: "1:444075822437:web:ab802ad0fb6600906d658c",
  measurementId: "G-C3RNELFX9X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
