// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDK-8y0KYUVY6cHQ6CKqTNJ16sUxx1FtJA",
  authDomain: "bookswap2-a73d4.firebaseapp.com",
  projectId: "bookswap2-a73d4",
  storageBucket: "bookswap2-a73d4.firebasestorage.app",
  messagingSenderId: "12097241729",
  appId: "1:12097241729:web:d3a957cd7308d645c78380",
  measurementId: "G-7L5RX4J9TN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
