/* ----------------------------------------------
            Firebase Initialization 
------------------------------------------------*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, addDoc, collection} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
const db = getFirestore(app);


/* ----------------------------------------------
            Upload Logic For Main Data 
------------------------------------------------*/

const submitBtn = document.getElementById("sub");
submitBtn.addEventListener('click', submitExp);

function submitExp(){
    event.preventDefault();
    const name = document.getElementById("heading").value;
    const des = document.getElementById("des").value;
    const link = document.getElementById("link").value;
    addDoc(collection(db, "experiments"), {
        name: name,
        description: des,
        link: link,
        date: new Date()
    }).then(() => {
        document.getElementById("heading").value = "";
        document.getElementById("des").value = "";
        document.getElementById("link").value = "";
    }).catch((error) => {
        alert(error.message);
    });
}