
import { initializeApp } from "firebase/app";
import {getAuth} from  'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDB6RaRzamU3ME_bAbYejKOIYeYGZy3yg0",
  authDomain: "irctc-546f3.firebaseapp.com",
  projectId: "irctc-546f3",
  storageBucket: "irctc-546f3.appspot.com",
  messagingSenderId: "189291226357",
  appId: "1:189291226357:web:0fa69cf8b3d5b0a0b951bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firebaseAuth = getAuth(app);
export default firebaseAuth;