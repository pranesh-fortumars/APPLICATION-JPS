import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBXtLh7HoYjofVzNgLSykQH12KYxZkzwI",
  authDomain: "jps-app-32e09.firebaseapp.com",
  projectId: "jps-app-32e09",
  storageBucket: "jps-app-32e09.firebasestorage.app",
  messagingSenderId: "361777358487",
  appId: "1:361777358487:web:a51d5668a4acb517d2abd2",
  measurementId: "G-FWR3F6Z2PE"
};

// Initialize Firebase safely for SSR (Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
