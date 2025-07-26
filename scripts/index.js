/* -----------------------------
        Animation on Scroll
--------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-heading, .animate-subheading, .animate-image, .animate-input, .animate-button')
            .forEach(el => observer.observe(el));
});

/* ----------------------------------------------
            Firebase Initialization 
------------------------------------------------*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, setDoc, doc, addDoc, collection, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

const loginBtn = document.getElementById('login_btn');
const newBtn = document.getElementById('new_btn');
const logoutBtn = document.getElementById('logout_btn');
const sendContactBtn = document.getElementById('sendContact');
const reviewBtn = document.getElementById('review_btn');
const reviewsContainer = document.getElementById("reviews");

/*--------------------------------
        Check User Status
--------------------------------*/

async function checkUserAuth() {
     onAuthStateChanged(auth, (user) => {
        if(user){
            document.getElementById("login_btn").style.display = "none";
            document.getElementById("new_btn").style.display = "none";

            document.getElementById("logout_btn").style.display = "block";
        }

     });
}

checkUserAuth();

/*---------------------------------
        Review Functionality
---------------------------------*/

async function fetchAllReviews() {
    try{
        const reviewsSnapshot = await getDocs(collection(db, "reviews"));
        reviewsContainer.innerHTML = ""; // Clear existing reviews

        const reviews = [];
        reviewsSnapshot.forEach(doc => {
            reviews.push(doc.data());
        });

        // Sort reviews by timestamp in descending order
        reviews.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

        // Take the last four reviews
        const lastFourReviews = reviews.slice(0, 4);

        lastFourReviews.forEach(reviewData => {
            const reviewCard = document.createElement("div");
            reviewCard.className = "review-card";
            reviewCard.innerHTML = `
            <div class="user-details">
                <h2 class="user-name">${reviewData.firstName || "Anonymous"}</h2>
                <p class="user-review">${reviewData.review}</p>
                <p class="user-date">${new Date(reviewData.timestamp.seconds * 1000).toLocaleDateString()}</p>
            </div>
            `;
            reviewsContainer.appendChild(reviewCard);
        });
    } catch (error) {
        alert("Error");
    }
}


fetchAllReviews();

loginBtn.addEventListener('click', goLogin);
newBtn.addEventListener('click', goNew);
sendContactBtn.addEventListener('click', sendContact);
reviewBtn.addEventListener('click', sendReview);

function goNew() {
    event.preventDefault();
    window.location.href = "addon/new.html";
}

function goLogin() {
    event.preventDefault();
    window.location.href = "addon/login.html";
}

/* ----------------------------------------------
            Contact Form Functionality
------------------------------------------------*/


function sendContact() {
    const firstName = document.querySelector('.name-inputs input[placeholder="First Name"]').value;
    const lastName = document.querySelector('.name-inputs input[placeholder="Last Name"]').value;
    const email = document.querySelector('input[placeholder="Email"]').value;
    const message = document.querySelector('textarea[placeholder="Your Message"]').value;

    if (!email || !message) {
        return;
    }else if (!validateEmail(email)){
        showModal("Wait !","Email is invalid!");
        return;
    }

    addDoc(collection(db, "messages"), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        message: message,
        timestamp: new Date()
    }).then(() => {
        alert("Message sent successfully!");
        document.querySelector('.name-inputs input[placeholder="First Name"]').value = "";
        document.querySelector('.name-inputs input[placeholder="Last Name"]').value = "";
        document.querySelector('input[placeholder="Email"]').value = "";
        document.querySelector('textarea[placeholder="Your Message"]').value = "";
    }).catch((error) => {
        console.error("Error sending message: ", error);
        alert("Failed to send message. Please try again later.");
    });

    console.log(`Contact Message:\nName: ${firstName} ${lastName}\nEmail: ${email}\nMessage: ${message}`);
    alert("Thank you for contacting! We'll reach out soon.");
}


function validateEmail(email) {
    // basic regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}


function sendReview() {
    const reviewText = document.getElementById("review").value;

    if (!reviewText) {
        return;
    }
    onAuthStateChanged(auth, (user) => {
        if (user) {
            getDoc(doc(db, "users", user.uid)).then((docSnapshot) => {
                const firstName = docSnapshot.data().firstName || "Anonymous";
                setDoc(doc(db, "reviews", user.uid), {
                    firstName: firstName,
                    review: reviewText,
                    timestamp: new Date()
                }).then(() => {
                    alert("Review submitted successfully!");
                    document.getElementById("review").value = "";
                }).catch((error) => {
                    console.error("Error submitting review: ", error);
                    alert("Failed to submit review. Please try again later.");
                });
            });
        } else {
            goLogin();
        }
    });
}

/*---------------------------
    Logout Functionality
-----------------------------*/

logoutBtn.addEventListener('click', logout);

function logout(){
    signOut(auth).then(() => {
        window.location.href = "index.html";
    })
    .catch((error) => {
        alert(error.message);
    });

}