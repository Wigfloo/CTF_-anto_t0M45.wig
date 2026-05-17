// ==========================================
// 1. ESTADO DEL JUEGO Y CONTROL DE CHEATING
// ==========================================

const gameState = {
    level: 1, // Rastrea en qué nivel va el jugador actualmente.
    
    // Aquí guardamos las respuestas de los niveles, pero CIFRADAS en SHA-256.
    // Si alguien abre este archivo para hacer trampa, solo verá este texto sin sentido.
    hashes: [
        "6c5b693d8a674305c6d78a969e22fd058683018b21349d144a7cb979ad91abba", // Hash del Nivel 1
        "b39acd52541fa011f4051d6e4486629f37c095dc3d6adf390d5b7767fe8dab1f", // Hash del Nivel 2
        "8d2689a6a2c6ff84cd61dbb8be258a4c0ad7e690666d0ae6d636d2cb9e875b65", // Hash del Nivel 3
        "1994e3f9c60270a102a2276ea48ab8bf3c9a5b9d3ddc75c0b151ab64fb27d870", // Hash del Nivel 4 
        "25144928d11a1b28ecdc54eb2ccdbaa57d7e59c251cc430d5a8071455b96d383", // Hash del Nivel 5 
        "5e713b05e5272bad5c7bb7d6ff69969da4777a1de79224dd8bfa86ceca0871d2"  // trama
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
        <h1 class="glitch" data-text="PHASE 02: RECON & TRAPS">PHASE 02: RECON & TRAPS</h1>
        <p>Access granted. You are inside the perimeter. Our deep scanners have detected that the administrator left 3 backup files forgotten in the root directory.</p>
        
        <div style="background: rgba(0, 255, 65, 0.05); border: 1px dashed #00FF41; padding: 15px; margin: 15px 0;">
            <p style="color: #00FF41; font-weight: bold; margin: 0 0 10px 0;">[ ALERTA DE INTELIGENCIA ]</p>
            <p>Solo uno de los siguientes archivos contiene la tabla de ruteo real. Los otros son señuelos para cazadores de recompensas:</p>
            <ul style="line-height: 1.6; color: white;">
                <li><code>/stick/falg.html</code></li>
                <li><code>/backup.txt</code></li>
                <li><code>/dont_open.txt</code></li>
            </ul>
        </div>

        <p><strong>MISSION:</strong> Prueba los archivos directamente en la URL de tu navegador (ejemplo: cambiar <code>index.html</code> por <code>/backup.txt</code>). Encuentra el correcto para hallar la compuerta secreta.</p>
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
    
        
    5: `<h1 class="glitch" data-text="PHASE 05: ENCRYPTED TRANSMISSION">PHASE 05: ENCRYPTED TRANSMISSION</h1>
        <p>You have triggered an internal alarm. The system is broadcasting an encrypted emergency beacon to the main core.</p>
        <p><strong>MISSION:</strong> Intercept the communication. Our sensors captured a heavily encoded text string flying through the system logs.</p>
        
        <div style="background: rgba(0,20,0,0.5); border: 1px solid #00FF41; padding: 15px; margin: 15px 0; text-align: center;">
            <p style="color: #ff003c; font-weight: bold; margin: 0 0 10px 0;">[ INTERCEPTED DATA STREAM ]</p>
            <code style="color: white; font-size: 1.1rem; letter-spacing: 1px;">VVNUQShDMVBoRVJfTTRTVDNSKQ==</code>
        </div>

        <p><strong>TASK:</strong> Decrypt the payload. The structure looks like standard radix-64 encoding. Find the tool to break it.</p>
        <p style="color: #555; font-size: 0.85rem;">
            (Hint: CyberChef is an analyst's best friend. Look for the "From Base64" recipe).
        </p>
    `,
    
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

  if (inputHash === "a5af542ed4ae9557144b79c669540d0b5026c68591836bfe9f62541d9ef50e2a" || 
        inputHash === "5e713b05e5272bad5c7bb7d6ff69969da4777a1de79224dd8bfa86ceca0871d2") {
        
        const container = document.getElementById('terminal-content');
        msg.innerHTML = "<span style='color: #FF003C; font-weight: bold;'>[ ¡SISTEMA COMPROMETIDO! AMENAZA DETECTADA ]</span>";
        
        // Ocultamos el área de inputs
        document.querySelector('.input-area').style.display = 'none';
        
        // Inyectamos la imagen del gato y el botón de reset
        // Se agregó un delay de 1 seg para darle misterio al mensaje de arriba
        setTimeout(() => {
            container.innerHTML = `
                <div style="text-align: center; padding: 10px;">
                    <h2 style="color: #ff003c;" class="glitch" data-text="HACKED BY A CAT?">HACKED BY A CAT?</h2>
                    <p style="color: white; font-style: italic; margin-bottom: 15px;">
                        Has caído en un Honeypot de nivel 1. No confíes en todo lo que encuentras en los logs.
                    </p>
                    
                    <img src="gato.jpeg" alt="Laughing Cat Trap" 
                        style="max-width: 100%; height: auto; border: 2px solid #ff003c; box-shadow: 0 0 15px #ff003c; margin-bottom: 20px;">
                    
                    <br>
                    <button onclick="localStorage.clear(); location.reload();" 
                        style="background: #ff003c; color: white; border: none; padding: 10px 20px; cursor: pointer; font-family: monospace;">
                        [ REINICIAR SISTEMA PARA INTENTAR DE NUEVO ]
                    </button>
                </div>
            `;
            msg.innerHTML = '';
        }, 1000);
        
        return; // Detiene la función aquí
    }
    
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
    fetch('auth_check?token=USTA(H34D3R_D4T4_M1N3R)', {
        method: 'GET',
        headers: {
            'X-Nexus-Auth': 'USTA(H34D3R_D4T4_M1N3R)',
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
                FLAG: USTA(C00K1E_M4N1PUL4T0R_X)
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