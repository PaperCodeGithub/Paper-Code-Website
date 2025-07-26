/* ----------------------------------------------
            Firebase Initialization 
------------------------------------------------*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyANTXAHzFmu5zY6k-KH73dCJwfNumK-Jnc",
    authDomain: "papercodeweb-c3423.firebaseapp.com",
    projectId: "papercodeweb-c3423",
    storageBucket: "papercodeweb-c3423.firebasestorage.app",
    messagingSenderId: "1411010921",
    appId: "1:1411010921:web:7a8bf23496a1fc46416df8",
    measurementId: "G-W9F9MH0PKQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ----------------------------------------------
           Custom Modal Functionality
------------------------------------------------*/

const modalCloseBtn = document.getElementById('modal_close_btn');
modalCloseBtn.addEventListener('click', closeModal);

function showModal(heading, description) {
    document.getElementById('customModal').querySelector('.heading').textContent = heading || "Notice";
    document.getElementById('customModal').querySelector('.description').textContent = description || " Nothing to see here!";
    document.getElementById('customModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('customModal').style.display = 'none';
}

/* ----------------------------------------------
           Password Toggle Functionality
------------------------------------------------*/

const toggle = document.getElementById('togglePassword');
const password = document.getElementById('password');

    toggle.addEventListener('click', () => {
        const type = password.type === 'password' ? 'text' : 'password';
        password.type = type;

        toggle.src = type === 'password' ? '../assets/icons/show_password_icon_close.png' : '../assets/icons/show_password_icon_open.png';
  });

/* ----------------------------------------------
           Register Button Functionality
------------------------------------------------*/

export const errorMessages = {
  'auth/invalid-email':            "Invalid email format. Please check your email.",
  'auth/user-disabled':            "This user account has been disabled.",
  'auth/user-not-found':           "No user found with this email. Please register.",
  'auth/wrong-password':           "Incorrect password. Please try again.",
  'auth/email-already-in-use':     "This email is already registered. Please login or use a different email.",
  'auth/operation-not-allowed':    "Operation not allowed. Please enable the sign-in method in Firebase Console.",
  'auth/weak-password':            "Weak password. Please use a stronger password.",
  'auth/invalid-credential':       "Invalid credentials. Please check and try again.",
  'auth/too-many-requests':        "Too many login attempts. Please try again later.",
  'auth/network-request-failed':   "Network error. Please check your connection.",
  'auth/requires-recent-login':    "Recent login required. Please sign in again before retrying.",
  'auth/app-not-authorized':       "This app is not authorized to use Firebase Auth with this API key.",
  'auth/invalid-verification-code':"Invalid verification code. Please retry.",
  'auth/invalid-verification-id':  "Invalid verification ID.",
  'auth/invalid-persistence-type': "Invalid persistence type. Must be 'local', 'session', or 'none'.",
  'auth/unsupported-persistence-type': "This browser does not support the specified persistence.",
  'auth/unauthorized-domain':      "Domain not authorized for authentication. Add it in Firebase Console.",
  'auth/invalid-action-code':      "This action code is invalid or expired.",
  'auth/expired-action-code':      "Action code has expired. Please request a new one.",
  'auth/captcha-check-failed':     "Captcha verification failed. Try again.",
  'auth/code-expired':             "SMS code has expired. Please resend the code.",
  'auth/invalid-phone-number':     "Invalid phone number format.",
  'auth/missing-phone-number':     "Phone number is required.",
  'auth/missing-verification-code':"Verification code is missing.",
  'auth/missing-verification-id':  "Verification ID is missing.",
  'auth/session-cookie-expired':   "Session cookie expired. Please sign in again.",
  'auth/internal-error':           "An internal error occurred. Please try again later.",
  'auth/no-such-provider':         "No such sign-in provider is associated with this account.",
  'auth/account-exists-with-different-credential':
      "An account already exists with the same email but different sign-in credentials.",
  'auth/invalid-oauth-provider':   "Unsupported OAuth provider.",
  'auth/popup-blocked':            "Popup was blocked by the browser.",
  'auth/popup-closed-by-user':     "Popup was closed before completing sign-in.",
  'auth/user-token-expired':       "User credential expired. Please sign in again.",
  'auth/null-user':                "No user is signed in.",
};

const registerBtn = document.getElementById('register_btn');

registerBtn.addEventListener('click', registerUser);

function registerUser(){
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (firstName && lastName && email && password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;

                setDoc(doc(db, "users", user.uid), {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    rights: "member"
                }).then(() => {
                    showModal("Registration Successful", "You have successfully registered!");
                    window.location.href = "../index.html";
                }).catch((error) => {
                    const message = errorMessages[error.code] || error.message;
                    showModal("Wait!", message);
                });
            })
            .catch((error) => {
                const message = errorMessages[error.code] || error.message;
                showModal("Wait!", message);
            });
    }
}