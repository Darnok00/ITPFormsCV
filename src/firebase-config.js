import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  //Your Configurations
};

export const app = initializeApp(firebaseConfig,{
  ignoreUndefinedProperties: true
});

export const storage = getStorage(app);
export const db = getFirestore(app);

