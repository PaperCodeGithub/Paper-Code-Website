
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

const errorMessages = {
    'auth/wrong-password':        "Incorrect password. Please try again.",
    'auth/user-not-found':        "No user found with this email. Please register.",
    'auth/invalid-email':         "Invalid email format. Please check your email.",
    'auth/too-many-requests':     "Too many login attempts. Please try again later.",
    'auth/network-request-failed':"Network error. Please check your internet connection.",
    'auth/operation-not-allowed': "Login operation is not allowed. Please contact support.",
    'auth/weak-password':         "Weak password. Please use a stronger password.",
    'auth/invalid-credential':    "Invalid credentials. Please check your email and password."
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
      console.error("Error fetching experiments:", error);
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
        showModal("Login Failed", message);
        
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