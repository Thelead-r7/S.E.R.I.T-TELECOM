// main.js

// Importer la config Firebase (assure-toi d’avoir firebase-config.js chargé avant)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPavrp_mfV0POiDF3V4ZOZ0SHZGwgTmGs",
  authDomain: "serit-societe.firebaseapp.com",
  projectId: "serit-societe",
  storageBucket: "serit-societe.firebasestorage.app",
  messagingSenderId: "25581120285",
  appId: "1:25581120285:web:b8ee391fabf3d626480ff4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Récupération et affichage des publications dans la galerie
async function afficherGalerie() {
  const galerie = document.getElementById("galerie");
  if (!galerie) return;

  const querySnapshot = await getDocs(collection(db, "publications"));
  galerie.innerHTML = ""; // Vider la galerie

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const div = document.createElement("div");
    div.className = "photo";

    const img = document.createElement("img");
    img.src = data.imageURL;
    img.alt = data.titre || "Publication";

    const titre = document.createElement("h3");
    titre.textContent = data.titre;

    const contenu = document.createElement("p");
    contenu.textContent = data.contenu;

    div.appendChild(img);
    div.appendChild(titre);
    div.appendChild(contenu);

    galerie.appendChild(div);
  });
}

// Lancer après chargement du DOM
document.addEventListener("DOMContentLoaded", afficherGalerie);
