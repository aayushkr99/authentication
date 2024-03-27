
import { initializeApp } from "firebase/app";
import {getAuth} from  'firebase/auth';

const firebaseConfig = {
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firebaseAuth = getAuth(app);
export default firebaseAuth;