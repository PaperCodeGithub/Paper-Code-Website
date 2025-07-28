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

/* --------------------------------------------
                Fetching Data
-----------------------------------------------*/

function checkUserRights(){
    onAuthStateChanged(auth, (user) => {
        if(user){
            getDoc(doc(db, "users", user.uid)).then((docSnapshot) => {
                const rights = docSnapshot.data()?.rights || "member";
                if(rights=="admin"){
                    document.getElementById("add-btn").style.display = "block";
                }else{
                    document.getElementById("add-btn").style.display = "none";
                }
            });
        }else{
            document.getElementById("add-btn").style.display = "none";
        }
    });
}

async function fetchTools() {
    const container = document.getElementById("card-container");
    container.innerHTML = "<p>Loading tools...</p>";

    try {
        const querySnapshot = await getDocs(collection(db, "tools"));
        container.innerHTML = "";

        if (querySnapshot.empty) {
            container.innerHTML = "<p>No tools found.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const tool = doc.data();

            const card = document.createElement("div");
            card.className = "project-card";

            // Use base64 image if available, else placeholder
            const imageTag = tool.image
                ? `<img class="project-image" src="${tool.image}" alt="${tool.name}" />`
                : `<div class="project-image" style="display:flex;align-items:center;justify-content:center;background:#eee;height:180px;border-radius:15px;">No Image</div>`;

            card.innerHTML = `
                ${imageTag}
                <h2 class="project-title">${tool.name}</h2>
                <p class="project-desc">${tool.description}</p>
                <p class="project-desc"><strong>Platform:</strong> ${tool.platform}</p>
                <div class="btn-group">
                    <button class="download-btn" onclick="window.open('${tool.link_download}', '_blank')">Download</button>
                    <button class="code-btn" onclick="window.open('${tool.link_source}', '_blank')">Source Code</button>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error fetching tools:", error);
        container.innerHTML = "<p>Failed to load tools.</p>";
    }
}

checkUserRights();
fetchTools();