import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC1ZgCCR-MakYRbA6Vw9I7QYWmITuOLC2M",
  authDomain: "medical-qr-50da9.firebaseapp.com",
  projectId: "medical-qr-50da9",
  storageBucket: "medical-qr-50da9.firebasestorage.app",
  messagingSenderId: "918654903799",
  appId: "1:918654903799:web:fa0d014fb068cb4f993af2",
  measurementId: "G-KEXK6MYLLC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const qrcodeDiv = document.getElementById("qrcode");

  downloadBtn.style.display = "none";

  generateBtn.addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim() || "No Name";
    const age = document.getElementById("age").value.trim() || "N/A";
    const blood = document.getElementById("blood").value.trim() || "N/A";
    const allergies = document.getElementById("allergies").value.trim() || "N/A";
    const doctor = document.getElementById("doctor").value.trim() || "N/A";
    const notes = document.getElementById("notes").value.trim() || "None";

    try {
      // Save to Firestore
      const docRef = await addDoc(collection(db, "medicalProfiles"), {
        name, age, blood, allergies, doctor, notes
      });

      const id = docRef.id;
      qrcodeDiv.innerHTML = "";

      // Use absolute URL to GitHub Pages
      const url = `https://hannahhaitham.github.io/medical-qr/medical.html?id=${id}`;

      // Generate QR code
      new QRCode(qrcodeDiv, {
        text: url,
        width: 200,
        height: 200,
        colorDark: "#d6336c",
        colorLight: "#fff0f6",
        correctLevel: QRCode.CorrectLevel.H
      });

      generateBtn.style.display = "none";
      downloadBtn.style.display = "block";

    } catch (err) {
      console.error("Error saving to Firestore:", err);
      alert("Failed to save info. Check console for details.");
    }
  });

  downloadBtn.addEventListener("click", () => {
    const qrCanvas = qrcodeDiv.querySelector("canvas");
    if (!qrCanvas) {
      alert("Please generate a QR code first!");
      return;
    }
    const imageURL = qrCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "medical-qr.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});