const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function draw() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff41";
    ctx.font = fontSize + "px arial";

    drops.forEach((y, i) => {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}
setInterval(draw, 33);

function checkFlag() {
    const input = document.getElementById('flag-input').value;
    const msg = document.getElementById('response-msg');
    
    // Aquí puedes poner un flag de prueba
    if (input === "CTF{H4ck_Th3_Pl4n3t}") {
        msg.innerHTML = "<p style='color: white;'>ACCESO CONCEDIDO. Siguiente nivel desbloqueado.</p>";
    } else {
        msg.innerHTML = "<p style='color: red;'>ERROR: FLAG INCORRECTA.</p>";
    }
}