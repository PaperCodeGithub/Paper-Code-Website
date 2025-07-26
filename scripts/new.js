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

import { getAuthErrorMessage } from "./component/firebase_errors";

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
                    const msg = getAuthErrorMessage(error.code, error.message);
                    showModal("Wait!", msg);
                });
            })
            .catch((error) => {
                const msg = getAuthErrorMessage(error.code, error.message);
                showModal("Ohh!", msg);
            });
    }
}