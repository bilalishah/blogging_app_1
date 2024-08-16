import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxXb38ltjA5xUYCTgT7wnJA0KMLIuyc10",
    authDomain: "blogging-website-bilal-shah.firebaseapp.com",
    projectId: "blogging-website-bilal-shah",
    storageBucket: "blogging-website-bilal-shah.appspot.com",
    messagingSenderId: "109503266937",
    appId: "1:109503266937:web:9ce3b0e8139257281214a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);