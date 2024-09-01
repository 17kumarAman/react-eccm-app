import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKEyNZ5qoGvdLiQpxm77lU4m21VhyUh14",
  authDomain: "react-eccom-app.firebaseapp.com",
  projectId: "react-eccom-app",
  storageBucket: "react-eccom-app.appspot.com",
  messagingSenderId: "400331036831",
  appId: "1:400331036831:web:218bd2d7804ed1417feaaa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signOutUser = () => signOut(auth);
