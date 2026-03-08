import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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
  const confirmBtn = document.getElementById("confirmBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const editBtn = document.getElementById("editBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const qrcodeDiv = document.getElementById("qrcode");
  const formInputs = document.querySelectorAll("#medicalForm input, #medicalForm textarea");

  let lastID = localStorage.getItem("lastMedicalID");

  // Load saved info
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

        formInputs.forEach(input => input.disabled = true);
        editBtn.style.display = "flex";
        deleteBtn.style.display = "flex";
        confirmBtn.style.display = "none";

        const url = `https://hannahhaitham.github.io/medical-qr/medical.html?id=${lastID}`;
        qrcodeDiv.innerHTML = "";
        new QRCode(qrcodeDiv, { text: url, width: 200, height: 200, colorDark: "#d6336c", colorLight: "#fff0f6", correctLevel: QRCode.CorrectLevel.H });
        downloadBtn.style.display = "block";
      }
    } catch (err) { console.error(err); }
  }

  // Confirm / Generate
  confirmBtn.addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim() || "No Name";
    const age = document.getElementById("age").value.trim() || "N/A";
    const blood = document.getElementById("blood").value.trim() || "N/A";
    const allergies = document.getElementById("allergies").value.trim() || "N/A";
    const doctor = document.getElementById("doctor").value.trim() || "N/A";
    const notes = document.getElementById("notes").value.trim() || "None";

    try {
      if (!lastID) {
        const docRef = await addDoc(collection(db, "medicalProfiles"), { name, age, blood, allergies, doctor, notes });
        lastID = docRef.id;
        localStorage.setItem("lastMedicalID", lastID);
      } else {
        await setDoc(doc(db, "medicalProfiles", lastID), { name, age, blood, allergies, doctor, notes });
      }

      formInputs.forEach(input => input.disabled = true);
      confirmBtn.style.display = "none";
      editBtn.style.display = "flex";
      deleteBtn.style.display = "flex";

      const url = `https://hannahhaitham.github.io/medical-qr/medical.html?id=${lastID}`;
      qrcodeDiv.innerHTML = "";
      new QRCode(qrcodeDiv, { text: url, width: 200, height: 200, colorDark: "#d6336c", colorLight: "#fff0f6", correctLevel: QRCode.CorrectLevel.H });
      downloadBtn.style.display = "block";
    } catch (err) { console.error(err); alert("Failed to save info."); }
  });

  // Edit
  editBtn.addEventListener("click", () => {
    formInputs.forEach(input => input.disabled = false);
    editBtn.style.display = "none";
    confirmBtn.style.display = "block";
  });

  // Delete
  deleteBtn.addEventListener("click", async () => {
    if (!lastID) return;
    if (!confirm("Are you sure you want to delete your saved medical info?")) return;

    try {
      await setDoc(doc(db, "medicalProfiles", lastID), { name: "", age: "", blood: "", allergies: "", doctor: "", notes: "" });
      formInputs.forEach(input => input.value = "");
      formInputs.forEach(input => input.disabled = false);
      editBtn.style.display = "none";
      deleteBtn.style.display = "none";
      confirmBtn.style.display = "block";
      qrcodeDiv.innerHTML = "";
      downloadBtn.style.display = "none";
      localStorage.removeItem("lastMedicalID");
      lastID = null;
    } catch (err) { console.error(err); alert("Failed to delete info."); }
  });

  // Download QR
  downloadBtn.addEventListener("click", () => {
    const qrCanvas = qrcodeDiv.querySelector("canvas");
    if (!qrCanvas) { alert("Generate QR first!"); return; }
    const imageURL = qrCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "medical-qr.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});