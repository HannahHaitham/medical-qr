import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC1ZgCCR-MakYRbA6Vw9I7QYWmITuOLC2M",
  authDomain: "medical-qr-50da9.firebaseapp.com",
  projectId: "medical-qr-50da9",
  storageBucket: "medical-qr-50da9.firebasestorage.app",
  messagingSenderId: "918654903799",
  appId: "1:918654903799:web:fa0d014fb068cb4f993af2",
  measurementId: "G-KEXK6MYLLC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
  const generateBtn = document.getElementById("generateBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const qrcodeDiv = document.getElementById("qrcode");

  downloadBtn.style.display = "none";

  // Load last saved info if exists
  let lastID = localStorage.getItem("lastMedicalID");
  if (lastID) {
    try {
      const docSnap = await getDoc(doc(db, "medicalProfiles", lastID));
      if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById("name").value = data.name;
        document.getElementById("age").value = data.age;
        document.getElementById("blood").value = data.blood;
        document.getElementById("allergies").value = data.allergies;
        document.getElementById("doctor").value = data.doctor;
        document.getElementById("notes").value = data.notes;

        // Generate QR code immediately for existing ID
        const url = `https://hannahhaitham.github.io/medical-qr/medical.html?id=${lastID}`;
        qrcodeDiv.innerHTML = "";
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
      }
    } catch (err) {
      console.error("Error loading last saved data:", err);
    }
  }

  // Generate button click
  generateBtn.addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim() || "No Name";
    const age = document.getElementById("age").value.trim() || "N/A";
    const blood = document.getElementById("blood").value.trim() || "N/A";
    const allergies = document.getElementById("allergies").value.trim() || "N/A";
    const doctor = document.getElementById("doctor").value.trim() || "N/A";
    const notes = document.getElementById("notes").value.trim() || "None";

    try {
      // If lastID exists, reuse it; otherwise, create new document
      if (!lastID) {
        const docRef = await addDoc(collection(db, "medicalProfiles"), {
          name, age, blood, allergies, doctor, notes
        });
        lastID = docRef.id;
        localStorage.setItem("lastMedicalID", lastID);
      } else {
        // Optionally: update existing Firestore doc if you want edits saved
        // await setDoc(doc(db, "medicalProfiles", lastID), {name, age, blood, allergies, doctor, notes});
      }

      // Generate QR code
      const url = `https://hannahhaitham.github.io/medical-qr/medical.html?id=${lastID}`;
      qrcodeDiv.innerHTML = "";
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

  // Download QR code
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