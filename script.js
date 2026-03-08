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

const generateBtn = document.getElementById("generateBtn");
const displayDiv = document.getElementById("displayInfo");

if (displayDiv) {
  // Display page
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    displayDiv.innerHTML = "<p>No medical ID provided.</p>";
  } else {
    getDoc(doc(db, "medicalProfiles", id))
      .then(docSnap => {
        if (!docSnap.exists()) {
          displayDiv.innerHTML = "<p>No medical info found.</p>";
          return;
        }
        const data = docSnap.data();
        displayDiv.innerHTML = `
          <div class="info-card">
            <h3>Medical Information</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Age:</strong> ${data.age}</p>
            <p><strong>Blood Type:</strong> ${data.blood}</p>
            <p><strong>Allergies:</strong> ${data.allergies}</p>
            <p><strong>Doctor:</strong> ${data.doctor}</p>
            <p><strong>Notes:</strong> ${data.notes}</p>
          </div>
        `;
      })
      .catch(err => {
        console.error(err);
        displayDiv.innerHTML = "<p>Error loading info.</p>";
      });
    }
}

// -----------------------
// Download QR Code Feature
// -----------------------
const downloadBtn = document.getElementById("downloadBtn");

if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    const qrCanvas = document.querySelector("#qrcode canvas");
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
}