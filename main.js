// ✅ main.js corrigé

// Importer Firebase App et Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDPavrp_mfV0POiDF3V4ZOZ0SHZGwgTmGs",
  authDomain: "serit-societe.firebaseapp.com",
  projectId: "serit-societe",
  storageBucket: "serit-societe.appspot.com",
  messagingSenderId: "25581120285",
  appId: "1:25581120285:web:b8ee391fabf3d626480ff4"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Fonction pour afficher les publications dans la galerie
async function afficherGalerie() {
  const galerie = document.getElementById("galerie");
  if (!galerie) return;

  try {
    const querySnapshot = await getDocs(collection(db, "publications"));
    galerie.innerHTML = ""; // Vider la galerie

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const div = document.createElement("div");
      div.className = "photo";

      const img = document.createElement("img");
      img.src = data.imageUrl;
      img.alt = data.titre || "Publication";

      const titre = document.createElement("h3");
      titre.textContent = data.titre;

      const contenu = document.createElement("p");
      contenu.textContent = data.description;

      div.appendChild(img);
      div.appendChild(titre);
      div.appendChild(contenu);

      galerie.appendChild(div);
    });

  } catch (error) {
    console.error("Erreur de chargement de la galerie :", error);
    galerie.innerHTML = "<p>Erreur de chargement.</p>";
  }
}

// ✅ Lancer après chargement du DOM
document.addEventListener("DOMContentLoaded", afficherGalerie);
