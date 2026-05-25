import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "ai-interview-simulator-8f31b.firebaseapp.com",
  projectId: "ai-interview-simulator-8f31b",
  storageBucket: "ai-interview-simulator-8f31b.firebasestorage.app",
  messagingSenderId: "184673363906",
  appId: "1:184673363906:web:fd1130401ef3ea4f14585b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth= getAuth(app);

const provider= new GoogleAuthProvider();

export {auth , provider}