
import { auth, db, storage } from "./firebase-config.js";
import { doc, setDoc, serverTimestamp, collection } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const adminUID = "Cz0wL0oT8PdsddwywLaNawqmPl93";

onAuthStateChanged(auth, user => {
  if (!user) {
    alert("Accès refusé. Veuillez vous connecter.");
    window.location.href = "connexion-admin.html";
  } else if (user.uid !== adminUID) {
    alert("Accès refusé : vous n'êtes pas autorisé.");
    signOut(auth);
    window.location.href = "connexion-admin.html";
  }
});

document.getElementById("publicationForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const titre = document.getElementById("titre").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").files[0];

  if (!titre || !description || !image) {
    alert("Tous les champs sont obligatoires.");
    return;
  }

  try {
    const imageRef = ref(storage, "publications/" + Date.now() + "-" + image.name);
    const snapshot = await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(snapshot.ref);

    await setDoc(doc(collection(db, "publications")), {
      titre,
      description,
      imageUrl,
      timestamp: serverTimestamp()
    });

    alert("Publication réussie !");
    document.getElementById("publicationForm").reset();
  } catch (error) {
    console.error("Erreur lors de la publication :", error);
    alert("Une erreur est survenue.");
  }
});
