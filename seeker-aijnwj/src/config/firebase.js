// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBOwQaNNEPe3zopMI-nLMKGZ_ve_qekSPo",
    authDomain: "nincekon-website.firebaseapp.com",
    projectId: "nincekon-website",
    storageBucket: "nincekon-website.firebasestorage.app",
    messagingSenderId: "248004174462",
    appId: "1:248004174462:web:d226b0e3bfbea2f896ee2f",
    measurementId: "G-H1PJ49PBP7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);