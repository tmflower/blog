import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAF16GP0GKGK4pb3trpmxQ65Ai1k5IxR8M",
  authDomain: "blog-746d1.firebaseapp.com",
  projectId: "blog-746d1",
  storageBucket: "blog-746d1.appspot.com",
  messagingSenderId: "423071867487",
  appId: "1:423071867487:web:531d1db699273aea41b1ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
