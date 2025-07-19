// Configuration Firebase
const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "TON_PROJET.firebaseapp.com",
  projectId: "TON_PROJET",
  storageBucket: "TON_PROJET.appspot.com",
  messagingSenderId: "TON_ID",
  appId: "TON_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const commentaireForm = document.getElementById("commentaireForm");
const commentaireText = document.getElementById("commentaireText");
const etoilesContainer = document.getElementById("etoilesContainer");
const listeCommentaires = document.getElementById("listeCommentaires");

let currentUser = null;
let selectedStars = 0;

// Génère les étoiles jaunes
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

// Gérer l’état utilisateur
auth.onAuthStateChanged(user => {
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

// Connexion Gmail
loginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
});

// Déconnexion
logoutBtn.addEventListener("click", () => {
  auth.signOut();
});

// Envoi d’un commentaire
function envoyerCommentaire() {
  const texte = commentaireText.value.trim();
  if (texte === "" || selectedStars === 0) {
    alert("Veuillez écrire un avis et choisir une note.");
    return;
  }

  const etoileBleue = selectedStars === 5;

  db.collection("commentaires").add({
    nom: currentUser.displayName,
    photo: currentUser.photoURL,
    texte: texte,
    etoiles: selectedStars,
    etoileBleue: etoileBleue,
    date: new Date()
  }).then(() => {
    commentaireText.value = "";
    selectedStars = 0;
    afficherEtoiles(0);
    afficherCommentaires();
  });
}

// Affichage public des commentaires
function afficherCommentaires() {
  listeCommentaires.innerHTML = "<p>Chargement des commentaires...</p>";
  db.collection("commentaires")
    .orderBy("date", "desc")
    .get()
    .then(snapshot => {
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
    });
}