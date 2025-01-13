// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEV_gCjg4ptHlOhAqgmF9IBa5Sp92cMLM",
  authDomain: "voglio-f5b0d.firebaseapp.com",
  projectId: "voglio-f5b0d",
  storageBucket: "voglio-f5b0d.firebasestorage.app",
  messagingSenderId: "496488766759",
  appId: "1:496488766759:web:23eed28fa9074283689d02"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;