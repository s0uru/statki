import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Twoja NOWA konfiguracja z projektu "statlk":
const firebaseConfig = {
  apiKey: "AIzaSyBgATW6qOcrIFTQ6bfWCnRRKHGnThK7HPY",
  authDomain: "statlk.firebaseapp.com",
  projectId: "statlk",
  storageBucket: "statlk.firebasestorage.app",
  messagingSenderId: "409324501592",
  appId: "1:409324501592:web:cadd3dd983c1d3ea24e82d"
};

// Singleton - zapobiega podwójnej inicjalizacji przy przeładowaniu
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0]; 
}

// Eksportujemy auth, żeby reszta aplikacji mogła go używać
export const auth = getAuth(app);
export default app;