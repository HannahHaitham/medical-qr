document.addEventListener("DOMContentLoaded", () => {

    const generateBtn = document.getElementById("generateBtn");
    const displayDiv = document.getElementById("displayInfo");
  
    // Button click: generate QR immediately
    generateBtn.addEventListener("click", () => {
  
      // Get form values (or default)
      const name = document.getElementById("name").value.trim() || "No Name";
      const age = document.getElementById("age").value.trim() || "N/A";
      const blood = document.getElementById("blood").value.trim() || "N/A";
      const allergies = document.getElementById("allergies").value.trim() || "N/A";
      const doctor = document.getElementById("doctor").value.trim() || "N/A";
      const notes = document.getElementById("notes").value.trim() || "None";
  
      // Step 1: Generate QR code immediately
      const tempURL = `https://hannahhaitham.github.io/medical-qr/index.html?name=${encodeURIComponent(name)}&age=${encodeURIComponent(age)}`;
      const qrcodeDiv = document.getElementById("qrcode");
      qrcodeDiv.innerHTML = ""; // clear previous QR
      new QRCode(qrcodeDiv, {
        text: tempURL,
        width: 200,
        height: 200,
        colorDark: "#d6336c",
        colorLight: "#fff0f6",
        correctLevel: QRCode.CorrectLevel.H
      });
  
      console.log("Temporary QR code generated:", tempURL);
  
      // Step 2: Save to Firebase in the background
      const profileData = { name, age, blood, allergies, doctor, notes };
  
      firebase.firestore().collection("medicalProfiles").add(profileData)
        .then((docRef) => {
  
          console.log("Firebase document saved with ID:", docRef.id);
  
          // Step 3: Update QR to point to Firebase ID
          const finalURL = `https://hannahhaitham.github.io/medical-qr/index.html?id=${docRef.id}`;
          qrcodeDiv.innerHTML = "";
          new QRCode(qrcodeDiv, {
            text: finalURL,
            width: 200,
            height: 200,
            colorDark: "#d6336c",
            colorLight: "#fff0f6",
            correctLevel: QRCode.CorrectLevel.H
          });
  
          console.log("Final QR code updated with Firebase ID:", finalURL);
  
        })
        .catch((error) => {
          console.error("Error saving to Firebase:", error);
          alert("Failed to save to Firebase. Check console.");
        });
  
    });
  
  });
  
  // Step 4: Fetch and display medical info if URL has ?id=XXXX
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  
  if (id) {
    const displayDiv = document.getElementById("displayInfo");
  
    console.log("Fetching medical info for ID:", id);
  
    firebase.firestore().collection("medicalProfiles").doc(id).get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
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
        } else {
          displayDiv.innerHTML = "<p>No medical information found.</p>";
        }
      })
      .catch((err) => {
        console.error("Error fetching medical info:", err);
        displayDiv.innerHTML = "<p>Error loading medical information.</p>";
      });
  }