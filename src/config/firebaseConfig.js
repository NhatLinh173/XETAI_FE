import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_UUd_VYTZux_0uryl7UOYtgSxYI6TUb8",
  authDomain: "xatai-a1865.firebaseapp.com",
  projectId: "xatai-a1865",
  storageBucket: "xatai-a1865.firebasestorage.app",
  messagingSenderId: "655540300464",
  appId: "1:655540300464:web:e957bb293fdddced65a975",
  measurementId: "G-50LX51FP98",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export các hàm cần thiết
export { auth, RecaptchaVerifier, signInWithPhoneNumber };
