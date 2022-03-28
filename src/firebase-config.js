import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSZD97tuSLx4PZMYfBYUEhBxqOK-69Dp8",
  authDomain: "cv-itp-forms.firebaseapp.com",
  projectId: "cv-itp-forms",
  storageBucket: "cv-itp-forms.appspot.com",
  messagingSenderId: "763481193413",
  appId: "1:763481193413:web:deaa97fddcad6490dbe9ac",
  measurementId: "G-7E2DD2WPZL"
};

export const app = initializeApp(firebaseConfig,{
  ignoreUndefinedProperties: true
});

export const storage = getStorage(app);
export const db = getFirestore(app);

