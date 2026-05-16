// ==========================================
// 1. ESTADO DEL JUEGO Y CONTROL DE CHEATING
// ==========================================

const gameState = {
    level: 1, // Rastrea en qué nivel va el jugador actualmente.
    
    // Aquí guardamos las respuestas de los niveles, pero CIFRADAS en SHA-256.
    // En lugar de guardar "USTA{W3LC0M3_T0_TH3_N3XUS}", guardamos su huella digital (hash).
    // Si alguien abre este archivo para hacer trampa, solo verá este texto sin sentido.
    hashes: [
        "93bd99033ecfa63cc65fcd92e5bc0bbf975cd242eb38413eabde19ca8ce0e950", // Hash del Nivel 1
        "28085a09e5389970d6672d41c7360324a7f194a4e5de9b00885a12361770b2ed", // Hash del Nivel 2
        "7f93533ccd08f7c31a6e1da959c7ab26a936db69bb764415abc5e1a025306bcc", // Hash del Nivel 3
        "b9afc537f538d7b92fdf17c5e8cf15826ed2aed5b45351424a6175b064c4847e", // Hash del Nivel 4 
        "c3306dea831b09bde0ce90cfe78e0773e08406d917e6090393d0b603e7d7fc0b", // Hash del Nivel 5 
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    console.log("Cargando nivel actual:", gameState.level);
    loadLevel(gameState.level);
});

// Aquí guardamos el HTML (el texto y diseño) de cada nivel.
// Al estar metidos dentro de esta variable de JavaScript, el código NO existe en la pantalla 
// inicial, por lo que los participantes no pueden inspeccionar el HTML para ver los niveles avanzados.
const levelsData = {
    1: `
        <h1 class="glitch" data-text="PHASE 01: RECONNAISSANCE">PHASE 01: RECONNAISSANCE</h1>
        <p>System identity confirmed. Entry point detected.</p>
        <p><strong>MISSION:</strong> All developers leave footprints. Inspect the foundation of this interface to find the bypass code.</p>
        <p style="color: #555;">(Hint: The secret is hidden in the source code comments)</p>
    `,
    2: `
        <h1 class="glitch" data-text="PHASE 02: DISCOVERY">PHASE 02: DISCOVERY</h1>
        <p>Access granted. You are now inside the perimeter.</p>
        <p><strong>MISSION:</strong> Finding the front door is easy; finding the maintenance hatch is harder. Search the root files that tell "crawlers" where NOT to look.</p>
        
        <button onclick="showHint()" style="background: transparent; color: #ff003c; border: 1px solid #ff003c; padding: 3px 10px; font-size: 0.8rem; margin-top: 10px;">
            [ REQUEST INTEL ]
        </button>
        <p id="hint-text" style="color: #888; display: none; font-style: italic; margin-top: 5px;">
            Tip: Web scrapers and indexers check a specific '.txt' file at the root of the domain to know which paths are forbidden. Try navigating there.
        </p>
    `,
    3: `
        <h1 class="glitch" data-text="PHASE 03: INTERCEPT">PHASE 03: INTERCEPT</h1>
        <p>Excellent. You know how to map a server's visible structure.</p>
        <p><strong>MISSION:</strong> The next code isn't on the page. It is traveling through the network in an authorization request.</p>
        <p><strong>TASK:</strong> Open your DevTools (F12), go to the <strong>Network</strong> tab, and find the request named <strong>"auth_check"</strong>. Look inside its headers.</p>
        
    
    `,

    4: `<h1 class="glitch" data-text="PHASE 04: PRIVILEGE ESCALATION">PHASE 04: PRIVILEGE ESCALATION</h1>
        <p>You have penetrated the inner network, but your current session lacks authorization to view the vault.</p>
        <p><strong>MISSION:</strong> The server identifies your identity using a local browser Cookie. Find it, hijack the session, and elevate your privileges to <strong>"admin"</strong>.</p>
        <p><strong>TASK:</strong> Inspect your browser storage, modify your token identity, and click the button below to query the secure database.</p>
        
        <button onclick="checkCookiePrivilege()" style="background: transparent; color: #ff003c; border: 1px solid #ff003c; padding: 5px 15px; cursor: pointer; margin-top: 15px;">
            [ QUERY SECURE VAULT ]
        </button>
        <div id="vault-output" style="margin-top: 15px; color: #ff003c; font-weight: bold;"></div>`,
    
        
    5: `<h1 class="glitch" data-text="PHASE 05: RAW BYTES ANALYSIS">PHASE 05: RAW BYTES ANALYSIS</h1>
        <p>A hacker doesn't just look at the surface. They look at the raw structure of the data.</p>
        <p><strong>MISSION:</strong> We've recovered this image from a Dark Web server. It seems to contain visual clues, but our intel suggests the REAL key is hidden where the eyes can't see.</p>
        <p><strong>TASK:</strong> Download the file and analyze its hexadecimal structure. use Hex Editor to solve.</p>
        
        <div style="text-align: center; margin-top: 20px;">
            <img src="Iwa64n_(4Yu_FI46.png" alt="Dark Web Iceberg" style="width: 300px; border: 1px solid #00FF41; box-shadow: 0 0 15px #00FF41;">
            <br><br>
            <a href="Iwa64n_(4Yu_FI46.png" download style="color: #00FF41; font-size: 0.8rem; text-decoration: none; border: 1px dashed #00FF41; padding: 10px;">
                [ DOWNLOAD ENCRYPTED_IMAGE.PNG ]
            </a>
        </div>
        <p></p>`,

    
    6: `<h1>PHASE 07: FUZZING</h1><p>Próximamente...</p>`,
    7: `<h1>PHASE 08: LOGIC INJECTION</h1><p>Próximamente...</p>`,
    8: `<h1>PHASE 09: REVERSE ENGINEERING</h1><p>Próximamente...</p>`,
    9: `<h1>PHASE 09: REVERSE ENGINEERING</h1><p>Próximamente...</p>`,
    10: `<h1>PHASE 10: FINAL BREACH</h1><p>El núcleo del sistema.</p>`
};

// ==========================================
// 2. MOTOR LÓGICO DE NIVELES
// ==========================================

// Este evento le dice al navegador: "Apenas termines de cargar el diseño de la página,
// ejecuta la función para pintar el Nivel 1 en pantalla".

// Inicializar la terminal cargando el progreso guardado
document.addEventListener("DOMContentLoaded", () => {
    // Intentamos leer si el usuario ya tenía un nivel guardado en su navegador
    const savedLevel = localStorage.getItem('nexus_level');
    
    if (savedLevel) {
        gameState.level = parseInt(savedLevel); // Si existe, ponemos ese nivel
    } else {
        gameState.level = 1; // Si es la primera vez que entra, arranca en el 1
    }
    
    loadLevel(gameState.level);
});

// Esta función borra el contenido viejo de la pantalla e inyecta el nuevo nivel.
function loadLevel(levelNum) {
    const container = document.getElementById('terminal-content'); // El contenedor de la terminal
    const path = document.getElementById('current-path'); // El texto que simula la ruta (ej: /level_01)
    
    // Si el nivel existe en nuestra base de datos (levelsData)...
    if (levelsData[levelNum]) {
        container.innerHTML = levelsData[levelNum]; // Inyecta el HTML del nivel correspondiente
        path.innerText = `/level_0${levelNum}`; // Actualiza la ruta visual en la interfaz de comandos
    } else {
        // Si ya no hay más niveles (pasó el nivel 10), muestra el mensaje de victoria total.
        container.innerHTML = "<h1 style='color: red;'>ROOT ACCESS GRANTED. SYSTEM COMPROMISED.</h1>";
    }
    if (levelNum === 3) {
    triggerIntercept();
    
    if (levelNum === 4) {
        setGuestCookie();
        if (!document.cookie.includes("user_role=")) {
        document.cookie = "user_role=guest; path=/; SameSite=Lax";
        console.log("Cookie user_role=guest generada automáticamente.");
    }
    }
}
}

// Esta función se ejecuta cuando el usuario hace clic en el botón "EXECUTE"
function verifyFlag() {
    // Captura el texto que el usuario escribió en la caja de texto y le borra los espacios en blanco extras.
    const input = document.getElementById('flag-input').value.trim();
    const msg = document.getElementById('system-msg'); // Zona para mostrar si acertó o falló
    
    // Convertimos lo que el usuario escribió en un hash SHA-256 usando la librería CryptoJS.
    const inputHash = CryptoJS.SHA256(input).toString();
    
    // Comparamos: ¿El hash de lo que escribió el usuario es IGUAL al hash que tenemos guardado para este nivel?
    if (inputHash === gameState.hashes[gameState.level - 1]) {
        msg.innerHTML = "<span style='color: #00FF41;'>[ ACCESS GRANTED ]</span>";
        
        gameState.level++; // Subimos de nivel en la variable
        localStorage.setItem('nexus_level', gameState.level); // ¡LO GUARDAMOS EN EL NAVEGADOR!
        
        setTimeout(() => {
            document.getElementById('flag-input').value = '';
            msg.innerHTML = '';
            loadLevel(gameState.level); // Cargamos el nuevo nivel 
        }, 1000);
    } else {
        msg.innerHTML = "<span style='color: #FF003C;'>[ ACCESS DENIED - INVALID FLAG ]</span>";
        setTimeout(() => msg.innerHTML = '', 2000);
    }

}

// ==========================================
// 3. ANIMACIÓN DE FONDO (MATRIX RAIN)
// ==========================================

const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

// Ajusta el lienzo (canvas) para que ocupe toda la resolución de la pantalla
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Los caracteres que van a caer en la lluvia digital
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
const fontSize = 16;
const columns = canvas.width / fontSize; // Calcula cuántas columnas de texto caben en la pantalla
const drops = Array(Math.floor(columns)).fill(1); // Define la posición vertical inicial de cada columna (todas empiezan arriba: 1)

// Función cíclica que dibuja la animación fotograma por fotograma
function drawMatrix() {
    // Dibuja un fondo negro semitransparente. Al no ser 100% opaco, los caracteres antiguos 
    // no se borran de golpe, dejando ese rastro difuminado característico de Matrix.
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#00FF41"; // Color verde fósforo para las letras
    ctx.font = fontSize + "px monospace"; // Fuente tipográfica fija de terminal

    // Recorre cada una de las columnas verticales
    for (let i = 0; i < drops.length; i++) {
        // Elige un carácter aleatorio de nuestra lista
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        
        // Dibuja el carácter en su respectiva columna (X) y altura (Y)
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Si el carácter llegó al fondo de la pantalla y el número aleatorio lo decide, 
        // reinicia la columna mandándola de vuelta al techo (0) para variar las alturas.
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        
        drops[i]++; // Mueve el siguiente carácter un espacio hacia abajo para el próximo fotograma
    }
}

// Ejecuta la función de dibujo cada 35 milisegundos para crear el movimiento fluido
setInterval(drawMatrix, 35);

function showHint() {
    const hint = document.getElementById('hint-text');
    if (hint) {
        hint.style.display = hint.style.display === 'none' ? 'block' : 'none';
    }
}
function triggerIntercept() {
    // Simulamos una petición. Aunque de error 404, la bandera se verá en las cabeceras.
    fetch('auth_check?token=USTA{H34D3R_D4T4_M1N3R}', {
        method: 'GET',
        headers: {
            'X-Nexus-Auth': 'USTA{H34D3R_D4T4_M1N3R}',
            'X-Mission-Status': 'Active'
        }
    }).catch(err => {
        console.log("Packet Intercepted: Check Network Tab.");
    });
}

// También la ejecutamos automáticamente cuando cargue el nivel 3
// Agrega esto dentro de tu función loadLevel(levelNum):
if (levelNum === 3) {
    triggerIntercept();
}

// ==========================================
// LÓGICA DEL NIVEL 4: COOKIES
// ==========================================

// Función para crear la cookie de invitado
function setGuestCookie() {
    // Si la cookie no existe, la creamos como 'guest'
    if (!document.cookie.includes("user_role=")) {
        document.cookie = "user_role=guest; path=/; max-age=3600;";
        console.log("Session Cookie generated: user_role=guest");
    }
}

// Función que ejecuta el botón para revisar si ya son Administradores
function checkCookiePrivilege() {
    const output = document.getElementById('vault-output');
    
    // Esta línea busca "user_role=admin" dentro de todas las cookies existentes
    const isMatched = document.cookie.split(';').some((item) => item.trim() === 'user_role=admin');

    if (isMatched) {
        output.style.color = "#00FF41";
        output.innerHTML = `
            <p>[ ACCESS GRANTED - WELCOME ADMINISTRATOR ]</p>
            <p style="color: white; border: 1px dashed #00FF41; padding: 10px; display: inline-block;">
                FLAG: USTA{C00K1E_M4N1PUL4T0R_X}
            </p>
        `;
    } else {
        output.style.color = "#ff003c";
        output.innerHTML = "[ ACCESS DENIED ] Current identity 'guest' is unauthorized to read core sectors.";
        
        // Log para que tú veas qué está leyendo el navegador realmente en la consola
        console.log("Cookies actuales detectadas:", document.cookie);
    }
}


//Borrar 
function goToLevel(targetLevel) {
    console.log("Forzando salto al nivel:", targetLevel);
    
    gameState.level = targetLevel; // Cambia el nivel en la memoria del juego
    localStorage.setItem('nexus_level', targetLevel); // Lo guarda en el navegador para que no se borre
    
    // Limpia inputs y mensajes viejos para que no estorben
    document.getElementById('flag-input').value = '';
    document.getElementById('system-msg').innerHTML = '';
    
    loadLevel(targetLevel); // Carga el nivel visualmente
}