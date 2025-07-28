import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

document.getElementById("sub").addEventListener("click", submitExp);

async function submitExp(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const des = document.getElementById("des").value;
    const plat = document.getElementById("plat").value;
    const linkd = document.getElementById("linkd").value;
    const links = document.getElementById("links").value;
    const file = document.getElementById("img").files[0];

    if (!file) {
        alert("Please select an image.");
        return;
    }

    const imageBase64 = await convertToBase64(file);

    addDoc(collection(db, "tools"), {
        name: name,
        description: des,
        platform: plat,
        link_download: linkd,
        link_source: links,
        image: imageBase64,
        date: new Date()
    }).then(() => {
        clearForm();
        alert("Book added!");
    }).catch((error) => {
        alert("Error: " + error.message);
    });
}

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);  // base64 string
        reader.onerror = reject;
        reader.readAsDataURL(file);  // converts to base64
    });
}

function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("des").value = "";
    document.getElementById("type").value = "";
    document.getElementById("lvl").value = "";
    document.getElementById("link").value = "";
    document.getElementById("img").value = "";
}
