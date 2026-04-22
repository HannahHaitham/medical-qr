document.addEventListener("DOMContentLoaded", () => {

    const startBtn = document.getElementById("startBtn");
    const continueBtn = document.getElementById("continueBtn");
    const homeLogo = document.getElementById("homeLogo");
    const lastNameText = document.getElementById("lastNameText");
  
    // Safety checks (prevents crashes if elements missing)
    if (!startBtn || !continueBtn || !lastNameText) return;
  
    // 🔥 CREATE NEW PROFILE → clear old data
    startBtn.addEventListener("click", () => {
      localStorage.removeItem("lastMedicalID");
      localStorage.removeItem("lastMedicalName");
      window.location.href = "form.html";
    });
  
    // 📦 LOAD SAVED DATA
    const lastID = localStorage.getItem("lastMedicalID");
    const lastName = localStorage.getItem("lastMedicalName");
  
    // 👇 CONTINUE BUTTON LOGIC
    if (!lastID) {
      continueBtn.style.display = "none";
    } else {
      continueBtn.style.display = "block";
  
      continueBtn.addEventListener("click", () => {
        window.location.href = "form.html";
      });
    }
  
    // 👤 LAST NAME DISPLAY (fixed + safer)
    if (lastName) {
      lastNameText.textContent = `Continue as ${lastName}`;
      lastNameText.style.display = "block";
    } else {
      lastNameText.textContent = "";
      lastNameText.style.display = "none";
    }
  
    // 🌙 LOGO THEME
    if (homeLogo) {
      const darkMode = localStorage.getItem("darkMode") === "enabled";
      homeLogo.src = darkMode ? "logo-light.png" : "logo-light.png";
    }
  
  });