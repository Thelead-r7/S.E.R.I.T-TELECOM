// ✅ avis.js corrigé

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDPavrp_mfV0POiDF3V4ZOZ0SHZGwgTmGs",
  authDomain: "serit-societe.firebaseapp.com",
  projectId: "serit-societe",
  storageBucket: "serit-societe.appspot.com",
  messagingSenderId: "25581120285",
  appId: "1:25581120285:web:b8ee391fabf3d626480ff4"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sélection des éléments HTML
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const commentaireForm = document.getElementById("commentaireForm");
const commentaireText = document.getElementById("commentaireText");
const etoilesContainer = document.getElementById("etoilesContainer");
const listeCommentaires = document.getElementById("listeCommentaires");

let currentUser = null;
let selectedStars = 0;

// ✅ Générer les étoiles jaunes interactives
function afficherEtoiles(nb) {
  etoilesContainer.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.innerHTML = "★";
    star.className = i <= nb ? "etoile-jaune" : "";
    star.addEventListener("click", () => {
      selectedStars = i;
      afficherEtoiles(i);
    });
    etoilesContainer.appendChild(star);
  }
}
afficherEtoiles(0);

// ✅ Gérer l’état de connexion/déconnexion utilisateur
onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    commentaireForm.style.display = "block";
  } else {
    currentUser = null;
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    commentaireForm.style.display = "none";
  }
  afficherCommentaires();
});

// ✅ Connexion via Google
loginBtn.addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).catch((error) => {
    console.error("Erreur de connexion :", error);
  });
});

// ✅ Déconnexion
logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

// ✅ Envoi d’un commentaire
commentaireForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const texte = commentaireText.value.trim();

  if (texte === "" || selectedStars === 0) {
    alert("Veuillez écrire un avis et choisir une note.");
    return;
  }

  const etoileBleue = selectedStars === 5;

  try {
    await addDoc(collection(db, "commentaires"), {
      nom: currentUser.displayName,
      photo: currentUser.photoURL,
      texte: texte,
      etoiles: selectedStars,
      etoileBleue: etoileBleue,
      date: new Date()
    });

    commentaireText.value = "";
    selectedStars = 0;
    afficherEtoiles(0);
    afficherCommentaires();

  } catch (error) {
    console.error("Erreur lors de l'envoi du commentaire :", error);
    alert("Erreur lors de l'envoi. Veuillez réessayer.");
  }
});

// ✅ Affichage public des commentaires
async function afficherCommentaires() {
  listeCommentaires.innerHTML = "<p>Chargement des commentaires...</p>";

  try {
    const q = query(collection(db, "commentaires"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);

    listeCommentaires.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "commentaire";
      div.innerHTML = `
        <p><img src="${data.photo}" alt="photo" /> <strong>${data.nom}</strong></p>
        <p>${data.texte}</p>
        <p>
          ${"★".repeat(data.etoiles).replace(/★/g, '<span class="etoile-jaune">★</span>')}
          ${data.etoileBleue ? '<span class="etoile-bleue">★</span>' : ""}
        </p>
      `;
      listeCommentaires.appendChild(div);
    });

  } catch (error) {
    listeCommentaires.innerHTML = "<p>Impossible de charger les commentaires.</p>";
    console.error("Erreur d'affichage des commentaires :", error);
  }
  }
