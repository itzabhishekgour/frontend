// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCDMH6ovm0jPK0giOVW1HXgNCO-P1lMq28",
  authDomain: "smartrestuarant-a741c.firebaseapp.com",
  projectId: "smartrestuarant-a741c",
  storageBucket: "smartrestuarant-a741c.firebasestorage.app",
  messagingSenderId: "736012429674",
  appId: "1:736012429674:web:bd8c980c5f10f54d809d13",
  measurementId: "G-1DP8M9JC2B"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };