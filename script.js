function generateQR() {
    const qrContainer = document.getElementById("qrcode");

    // Clear previous QR code if there is one
    qrContainer.innerHTML = "";

    // Here we put the link that the QR code will point to
    // Replace this with your Live Server URL
    new QRCode(qrContainer, {
        text: "http://192.168.1.6/medical.html",  // <- THIS IS STEP 4
        width: 200,
        height: 200
    });
}