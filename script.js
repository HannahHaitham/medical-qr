document.addEventListener("DOMContentLoaded", () => {

    const generateBtn = document.getElementById("generateBtn");
    const displayDiv = document.getElementById("displayInfo");
  
    console.log("Firebase db object:", firebase, firebase.firestore());
  
    generateBtn.addEventListener("click", () => {
  
      console.log("Generate button clicked");
  
      const name = document.getElementById("name").value.trim();
      const age = document.getElementById("age").value.trim();
      const blood = document.getElementById("blood").value.trim();
      const allergies = document.getElementById("allergies").value.trim();
      const doctor = document.getElementById("doctor").value.trim();
      const notes = document.getElementById("notes").value.trim();
  
      const profileData = { name, age, blood, allergies, doctor, notes };
  
      // Save profile to Firebase
      firebase.firestore().collection("medicalProfiles").add(profileData)
        .then((docRef) => {
  
          console.log("Document written with ID:", docRef.id);
  
          const id = docRef.id;
          const url = `https://hannahhaitham.github.io/medical-qr/index.html?id=${id}`;
  
          // Generate QR code
          const qrcodeDiv = document.getElementById("qrcode");
          qrcodeDiv.innerHTML = "";
          new QRCode(qrcodeDiv, {
            text: url,
            width: 200,
            height: 200,
            colorDark: "#d6336c",
            colorLight: "#fff0f6",
            correctLevel: QRCode.CorrectLevel.H
          });
  
          console.log("QR code generated for URL:", url);
  
        })
        .catch((error) => {
          console.error("Error saving document:", error);
          alert("Error saving medical info. Check console.");
        });
  
    });
  
  });
  
  // ----- Fetch medical info when visiting ?id=xxxx -----
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