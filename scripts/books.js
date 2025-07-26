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

async function fetchBooks(){
    const container = document.getElementById("booksContainer");
    container.innerHTML = "Loading books...";
    try{
        const querySnapshot = await getDocs(collection(db, "books"));
        container.innerHTML = "";
        
        if (querySnapshot.empty) {
                container.innerHTML = "<p>No books found.</p>";
        }

        querySnapshot.forEach((doc) => {
            const book = doc.data();
            const card = document.createElement("div");
            card.className = "book-card";

            const imageTag = book.image 
              ? `<img class="book-image" src="${book.image}" alt="${book.name}" />`
              : `<div class="book-image placeholder">No Image</div>`;

            card.innerHTML = `
            <div class="book-info">
                ${imageTag}
                <h2>${book.name}</h2>
                <p>${book.description}</p>
                <p class="type"><strong>Type:</strong> ${book.type}</p>
                <p class="level"><strong>Level:</strong> ${book.level}</p>
                <button onclick="window.open('${book.link}', '_blank')">Read Now</button>
            </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
      console.error("Error fetching books:", error);
      container.innerHTML = "<p>Failed to load books.</p>";
    }
}
checkUserRights();
fetchBooks();