import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 1. Dodaj import

const firebaseConfig = {
  apiKey: "AIzaSyBgATW6qOcrIFTQ6bfWCnRRKHGnThK7HPY",
  authDomain: "statlk.firebaseapp.com",
  projectId: "statlk",
  storageBucket: "statlk.firebasestorage.app",
  messagingSenderId: "409324501592",
  appId: "1:409324501592:web:cadd3dd983c1d3ea24e82d"
};

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0]; 
}

export const auth = getAuth(app);
export const db = getFirestore(app); // 2. Eksportuj bazę danych
export default app;