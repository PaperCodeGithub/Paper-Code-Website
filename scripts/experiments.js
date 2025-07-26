
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
            Firebase Initialization 
------------------------------------------------*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, collection} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

/*--------------------------
    Layout Settings
--------------------------*/

function checkRights() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            getDoc(doc(db, "users", user.uid)).then((docSnapshot) => {
              const rights = docSnapshot.data()?.rights || "member";
              if (rights === "admin") {
                document.getElementById("new-btn").style.display = "block";
              } else {
                document.getElementById("new-btn").style.display = "none";
              }
          }).catch((error) => {
              console.error("Error fetching rights:", error);
              document.getElementById("new-btn").style.display = "none";
          });
        } else {
            document.getElementById("new-btn").style.display = "none";
        }
    });
}


/*--------------------------
    Fetch Exps
--------------------------*/

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



async function fetchExperiments() {
    const experimentsRef = collection(db, "experiments");

    try {
        const snapshot = await getDocs(experimentsRef);
        const experiments = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          experiments.push({
            id: doc.id,
            name: data.name,
            description: data.description,
            link: data.link,
            date: data.date
          });
        });

      console.log("Fetched Experiments:", experiments);
      return experiments;

  } catch (error) {
      const message = errorMessages[error.code] || error.message;
      showModal("Error", message);
      return [];
  }
}

function fetchData(){
    const loading = document.getElementById("loading");
    loading.style.display = "block";
    
  fetchExperiments().then((experiments) => {
      const container = document.getElementById("experiments-container");
      container.innerHTML = "";

      experiments.forEach(exp => {
          const card = document.createElement("div");
          card.className = "exp-card";
          card.innerHTML = `
            <h2>${exp.name}</h2>
            <p>${exp.description}</p>
            <p class="date"><strong>Date:</strong> ${new Date(exp.date.seconds * 1000).toLocaleDateString()}</p>
            <a href="${exp.link}" target="_blank"><button class="view-btn">View</button></a>
          `;
          container.appendChild(card);
      });
      loading.style.display = "none";
    }).catch((err) => {
        const message = errorMessages[error.code] || error.message;
        showModal("Error", message);
        
    });

    checkRights();
}

fetchData();



/*--------------------------
      Button Task
----------------------------*/

const new_project_btn = document.getElementById("new-btn");
new_project_btn.addEventListener('click', addNewProject);

function addNewProject(){
  window.location.href = "admin/admin_add_new_exp.html";
}