document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generateBtn");
    const displayDiv = document.getElementById("displayInfo");
  
    // Function to get URL parameters
    function getParams() {
      const params = {};
      const queryString = window.location.search.slice(1);
      if (!queryString) return params;
      queryString.split("&").forEach(pair => {
        const [key, value] = pair.split("=");
        params[key] = decodeURIComponent(value.replace(/\+/g, " "));
      });
      return params;
    }
  
    // Display info if page opened via QR code
    const params = getParams();
    if (Object.keys(params).length > 0) {
      let html = '<div class="info-card"><h3>Medical Info</h3>';
      for (const key in params) {
        html += `<p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${params[key]}</p>`;
      }
      html += "</div>";
      displayDiv.innerHTML = html;
    }
  
    // Generate QR code linking to GitHub Pages with URL parameters
    generateBtn.addEventListener("click", () => {
      const qrcodeDiv = document.getElementById("qrcode");
      qrcodeDiv.innerHTML = "";
  
      const name = document.getElementById("name").value.trim();
      const age = document.getElementById("age").value.trim();
      const blood = document.getElementById("blood").value.trim();
      const allergies = document.getElementById("allergies").value.trim();
      const doctor = document.getElementById("doctor").value.trim();
      const notes = document.getElementById("notes").value.trim();
  
      const baseURL = "https://hannahhaitham.github.io/medical-qr/";
      const paramsArray = [];
      if (name) paramsArray.push(`name=${encodeURIComponent(name)}`);
      if (age) paramsArray.push(`age=${encodeURIComponent(age)}`);
      if (blood) paramsArray.push(`blood=${encodeURIComponent(blood)}`);
      if (allergies) paramsArray.push(`allergies=${encodeURIComponent(allergies)}`);
      if (doctor) paramsArray.push(`doctor=${encodeURIComponent(doctor)}`);
      if (notes) paramsArray.push(`notes=${encodeURIComponent(notes)}`);
  
      const fullURL = paramsArray.length > 0 ? `${baseURL}?${paramsArray.join("&")}` : baseURL;
  
      new QRCode(qrcodeDiv, {
        text: fullURL,
        width: 200,
        height: 200,
        colorDark: "#d6336c",
        colorLight: "#fff0f6",
        correctLevel: QRCode.CorrectLevel.H
      });
    });
  });