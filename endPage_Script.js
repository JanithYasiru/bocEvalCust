import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js"

const firebaseConfig = {
    apiKey: "AIzaSyC0JLvxC286PUDwjx2oeEkhOMTr_TsYPRg",
    authDomain: "evaluationsysboc.firebaseapp.com",
    projectId: "evaluationsysboc",
    storageBucket: "evaluationsysboc.appspot.com",
    messagingSenderId: "581990176597",
    appId: "1:581990176597:web:2c5dd4ed7df2f3babc01dc",
    measurementId: "G-MZ4TLL0THZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

const MainForm = document.getElementById('MainForm');

let exitFromQues = evt => {
    evt.preventDefault();

    sessionStorage.removeItem("branch-num");

    // Manipulate history to prevent going back
    history.pushState(null, null, location.href);
    history.back();
    history.forward();

    window.close();
    // Redirect to a new page
    //window.location.replace('thank_you.html'); // Replace with your desired URL
}

MainForm.addEventListener('submit', exitFromQues);