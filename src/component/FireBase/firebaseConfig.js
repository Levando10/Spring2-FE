import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAkBg2fR3MT3zAVhBtT4R_l2VVNG37wRBU",
    authDomain: "sellglasses-13e72.firebaseapp.com",
    projectId: "sellglasses-13e72",
    storageBucket: "sellglasses-13e72.appspot.com",
    messagingSenderId: "277281690667",
    appId: "1:277281690667:web:c9e14d294489f9a3f7c66e",
    measurementId: "G-VVKX9RY3MX"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app)