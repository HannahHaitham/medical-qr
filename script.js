import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {

  // ELEMENTS
  const confirmBtn = document.getElementById("confirmBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const editBtn = document.getElementById("editBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const qrcodeDiv = document.getElementById("qrcode");
  const form = document.getElementById("medicalForm");
  const deleteModal = document.getElementById("deleteModal");
  const confirmDeleteBtn = document.getElementById("confirmDelete");
  const cancelDeleteBtn = document.getElementById("cancelDelete");

  const profileBtn = document.querySelector(".profile-btn");
  const profilePanel = document.getElementById("profilePanel");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const sunIcon = document.getElementById("sunIcon");
  const moonIcon = document.getElementById("moonIcon");

  let lastID = localStorage.getItem("lastMedicalID");

  // --- CONDITIONAL FIELDS ---
  const conditionalFields = {
    allergiesYesNo: "allergies",
    diabetes: "diabetesType",
    epilepsy: "epilepsyType",
    strokeHistory: "strokeType",
    asthma: "asthmaType",
    smoke: "smokeFreq",
    highBP: "highBPType",
    lowBP: "lowBPType"
  };

  Object.keys(conditionalFields).forEach(parentId => {
    const parent = document.getElementById(parentId);
    const child = document.getElementById(conditionalFields[parentId]);
    if (!parent || !child) return;

    child.style.display = parent.value === "Yes" ? "block" : "none";

    parent.addEventListener("change", () => {
      if (parent.value === "Yes") child.style.display = "block";
      else {
        child.style.display = "none";
        child.value = "";
      }
    });
  });

  // --- LOAD EXISTING DATA ---
  if (lastID) {
    try {
      const docSnap = await getDoc(doc(db, "medicalProfiles", lastID));
      if (docSnap.exists()) {
        const data = docSnap.data();
        for (const key in data) {
          if (document.getElementById(key)) {
            document.getElementById(key).value = data[key];
            // show conditional child fields if needed
            if (Object.values(conditionalFields).includes(key)) {
              document.getElementById(key).style.display = "block";
            }
          }
        }
        form.querySelectorAll("input, textarea, select").forEach(el => el.disabled = true);
        editBtn.style.display = "flex";
        deleteBtn.style.display = "flex";
        confirmBtn.style.display = "none";

        const url = `https://hannahhaitham.github.io/medical-qr/medical.html?id=${lastID}`;
        qrcodeDiv.innerHTML = "";
        new QRCode(qrcodeDiv, {
          text: url,
          width: 200,
          height: 200,
          colorDark: "#1da1f2",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
        downloadBtn.style.display = "block";
      }
    } catch (err) { console.error(err); }
  }

  // --- CONFIRM / SAVE DATA ---
  confirmBtn.addEventListener("click", async () => {
    const fields = [
      "name", "age", "allergies", "allergiesYesNo",
      "blood", "diabetes", "diabetesType", "highBP", "highBPType",
      "lowBP", "lowBPType", "strokeHistory", "strokeType", "DNR",
      "organDonor", "medicine", "asthma", "asthmaType", "smoke", "smokeFreq",
      "epilepsy", "epilepsyType", "notes", "emergencyContact"
    ];

    const dataToSave = {};
    fields.forEach(f => {
      const el = document.getElementById(f);
      if (!el) return;
      const val = el.value.trim();
      if (val && val !== "No") dataToSave[f] = val;
    });

    if (!dataToSave.name) dataToSave.name = "No Name"; // always have a name

    try {
      if (!lastID) {
        const docRef = await addDoc(collection(db, "medicalProfiles"), dataToSave);
        lastID = docRef.id;
        localStorage.setItem("lastMedicalID", lastID);
      } else {
        await setDoc(doc(db, "medicalProfiles", lastID), dataToSave);
      }

      form.querySelectorAll("input, textarea, select").forEach(el => el.disabled = true);
      confirmBtn.style.display = "none";
      editBtn.style.display = "flex";
      deleteBtn.style.display = "flex";

      const url = `https://hannahhaitham.github.io/medical-qr/medical.html?id=${lastID}`;
      qrcodeDiv.innerHTML = "";
      new QRCode(qrcodeDiv, {
        text: url,
        width: 200,
        height: 200,
        colorDark: "#1da1f2",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
      downloadBtn.style.display = "block";
    } catch (err) { console.error(err); alert("Failed to save info."); }
  });

  // --- EDIT ---
  editBtn.addEventListener("click", () => {
    form.querySelectorAll("input, textarea, select").forEach(el => el.disabled = false);
    editBtn.style.display = "none";
    confirmBtn.style.display = "block";
  });

  // --- DELETE ---
  deleteBtn.addEventListener("click", () => { deleteModal.style.display = "flex"; });
  cancelDeleteBtn.addEventListener("click", () => { deleteModal.style.display = "none"; });

  confirmDeleteBtn.addEventListener("click", async () => {
    deleteModal.style.display = "none";
    if (!lastID) return;

    try {
      await setDoc(doc(db, "medicalProfiles", lastID), {});
      form.querySelectorAll("input, textarea, select").forEach(el => el.value = "");
      form.querySelectorAll("input, textarea, select").forEach(el => el.disabled = false);
      editBtn.style.display = "none";
      deleteBtn.style.display = "none";
      confirmBtn.style.display = "block";
      qrcodeDiv.innerHTML = "";
      downloadBtn.style.display = "none";
      localStorage.removeItem("lastMedicalID");
      lastID = null;
    } catch (err) { console.error(err); alert("Failed to delete info."); }
  });

  // --- DOWNLOAD QR ---
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

  // --- PROFILE PANEL TOGGLE ---
  function isMobile() { return window.innerWidth <= 768; }

  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // stop document listener from firing
    if(profilePanel.style.left === "0px"){
      profilePanel.style.left = "-260px";
      profileBtn.style.left = "10px";
    } else {
      profilePanel.style.left = "0px";
      profileBtn.style.left = "260px";
    }
  });
  
  document.addEventListener("click", (e) => {
    // only close if panel is open AND click is outside
    if(profilePanel.style.left === "0px" &&
       !profilePanel.contains(e.target) &&
       !profileBtn.contains(e.target)){
      profilePanel.style.left = "-260px";
      profileBtn.style.left = "10px";
    }
  });

  // --- DARK/LIGHT MODE ---
  function rotateIcon(icon){
    icon.classList.add("rotate-icon");
    setTimeout(()=> icon.classList.remove("rotate-icon"), 500);
  }

  if(localStorage.getItem("darkMode")==="enabled"){
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
  } else {
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
  }

  darkModeToggle.addEventListener("change", ()=>{
    if(darkModeToggle.checked){
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode","enabled");
      sunIcon.style.display = "block";
      moonIcon.style.display = "none";
      rotateIcon(sunIcon);
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode","disabled");
      sunIcon.style.display = "none";
      moonIcon.style.display = "block";
      rotateIcon(moonIcon);
    }
  });

});