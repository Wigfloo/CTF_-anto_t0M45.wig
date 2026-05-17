// ==========================================
// 1. ESTADO DEL JUEGO Y CONTROL DE CHEATING
// ==========================================

const gameState = {
    level: 1, // Rastrea en qué nivel va el jugador actualmente.
    
    // Aquí guardamos las respuestas de los niveles, pero CIFRADAS en SHA-256.
    // Si alguien abre este archivo para hacer trampa, solo verá este texto sin sentido.
    hashes: [
        "6c5b693d8a674305c6d78a969e22fd058683018b21349d144a7cb979ad91abba", // Hash del Nivel 1
        "b238b74501b3a082ed8342554e9d7bf27a2ced6454514abb7f6f369c1651185e", // Hash del Nivel 2
        "8d2689a6a2c6ff84cd61dbb8be258a4c0ad7e690666d0ae6d636d2cb9e875b65", // Hash del Nivel 3
        "171205345b3e23ef8f32831d974143f01bbc81eeb7ce3834ecfa548deb739da6", // Hash del Nivel 4 
        "25144928d11a1b28ecdc54eb2ccdbaa57d7e59c251cc430d5a8071455b96d383", // Hash del Nivel 5 
        "9b56811afcf7b190610e681c71b79277419e87e5fee385aa5a59f65b66338b5a", // Hash del nivel 6
        "a0b9d2d6e4c38d5642d0c8edf4d023cc1f5dbb934d5fd3de410643a4140365b8", // Hash del nivel 7
        "3183d67815c6d0b97139fa304645d14964caeacb214e131f7c21f02db9d6a2ac", // Hash del nivel 8

        "5e713b05e5272bad5c7bb7d6ff69969da4777a1de79224dd8bfa86ceca0871d2", // trampa
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

   4: `
        <h1 class="glitch" data-text="PHASE 04: PRIVILEGE ESCALATION">PHASE 04: PRIVILEGE ESCALATION</h1>
        <p>El sistema identifica tu rango mediante una variable bloqueada en la interfaz gráfica.</p>
        
        <div style="border: 1px dashed #00FF41; padding: 15px; margin: 15px 0; background: rgba(0,0,0,0.3);">
            <p style="margin: 0 0 10px 0; color: #aaa;">[ CONTROL DE ACCESO LOCAL ]</p>
            <label>Rango Asignado: </label>
            <input type="text" id="role-lock" value="guest" disabled 
                style="background: #222; color: #ff003c; border: 1px solid #ff003c; padding: 5px; text-align: center; font-weight: bold; font-family: monospace;">
        </div>

        <p><strong>MISSION:</strong> El botón de abajo lee el valor de esa caja. Usa el Inspector (F12), elimina el candado (<code>guest</code>) de la caja, cambia el texto por <strong>"admin"</strong> y solicita la credencial.</p>
        
        <button onclick="checkDOMPrivilege()" style="background: #00FF41; color: black; border: none; padding: 8px 15px; cursor: pointer; font-family: monospace; font-weight: bold;">
            [ ENVIAR PETICIÓN DE RANGO ]
        </button>
        
        <div id="dom-status" style="margin-top: 15px; font-weight: bold;"></div>
    `,
        
   5: `<h1 class="glitch" data-text="FASE 05: TRANSMISIÓN ENCRIPTADA">FASE 05: TRANSMISIÓN ENCRIPTADA</h1>
        <p>Has activado una alarma interna. El sistema está transmitiendo una baliza de emergencia encriptada hacia el núcleo principal.</p>
        <p><strong>MISIÓN:</strong> Intercepta la comunicación. Nuestros sensores capturaron una cadena de texto fuertemente codificada volando a través de los registros del sistema.</p>
        
        <div style="background: rgba(0,20,0,0.5); border: 1px solid #00FF41; padding: 15px; margin: 15px 0; text-align: center;">
            <p style="color: #ff003c; font-weight: bold; margin: 0 0 10px 0;">[ TRANSMISIÓN DE DATOS INTERCEPTADA ]</p>
            <code style="color: white; font-size: 1.1rem; letter-spacing: 1px;">VlZOVVFTaERNVkJvUlZKZlRUUlRWRE5TS1E9PQ==</code>
        </div>

        <p><strong>TAREA:</strong> Desencripta la carga útil (payload). La estructura parece una codificación radix-64 estándar. Encuentra la herramienta para romperla.</p>
        <p style="color: #555; font-size: 0.85rem;">
            (Pista: CyberChef es el mejor amigo de un analista. Busca la receta "From Base64" varias veces).
        </p>
    `,
    
6: `
        <h1 class="glitch" data-text="PHASE 06: OS COMMAND INJECTION">PHASE 06: OS COMMAND INJECTION</h1>
        <p>Hemos encontrado un panel de diagnóstico de red interno que ejecuta comandos directamente en el servidor central.</p>
        
        <div style="border: 1px solid #00FF41; padding: 15px; margin: 15px 0; background: #020202;">
            <p style="color: #00FF41; margin-top: 0;">[ NEXUS PING UTILITY v2.1 ]</p>
            <label>IP de Destino: </label>
            <input type="text" id="ping-input" placeholder="ej. 127.0.0.1" 
                style="background: #111; color: #00FF41; border: 1px solid #00FF41; padding: 5px; font-family: monospace; width: 180px;">
            <button onclick="executePingTool()" style="background: #00FF41; color: black; border: none; padding: 5px 10px; cursor: pointer; font-family: monospace; font-weight: bold;">
                [ PING ]
            </button>
            
            <pre id="ping-output" style="margin-top: 15px; color: #aaa; background: #000; padding: 10px; border: 1px solid #333; font-size: 0.85rem; text-align: left; max-height: 150px; overflow-y: auto;"></pre>
        </div>

        <p><strong>MISSION:</strong> La aplicación no sanitiza los caracteres especiales. Intenta encadenar un comando de consola (como <code>ls</code> = (ver archivos) o <code>cat</code> =(ver contenido) ) usando operadores web (<code>;</code> o <code>&&</code>) para listar los archivos del servidor y leer el archivo secreto.</p>
    `,

  7: `
        <h1 class="glitch" data-text="PHASE 07: DIGITAL FORENSICS">PHASE 07: DIGITAL FORENSICS</h1>
        <p>Una imagen dice más que mil palabras... y a veces, guarda códigos de acceso secretos en sus metadatos ocultos.</p>
        
        <div style="text-align: center; margin: 20px 0; border: 1px solid #00FF41; padding: 15px; background: rgba(0,0,0,0.5);">
            <p style="color: #ffff00; margin-top: 0;">[ DETECTADO: ARCHIVO SOSPECHOSO ]</p>
            
            <img src="Iwa64n_(4Yu_FI46.png" alt="Blueprint" style="width: 180px; border: 1px solid #333; margin-bottom: 15px; cursor: pointer;" onclick="window.open('Iwa64n_(4Yu_FI46.png', '_blank')">
            <br>
            
            <a href="Iwa64n_(4Yu_FI46.png" download style="background: transparent; color: #00FF41; border: 1px dashed #00FF41; padding: 8px 15px; cursor: pointer; font-family: monospace; font-weight: bold; text-decoration: none; display: inline-block;">
                [ DESCARGAR ARCHIVO: Iwa64n_(4Yu_FI46.png ]
            </a>
        </div>

        <p><strong>MISSION:</strong> El token de acceso ha sido incrustado en los metadatos de este archivo PNG.</p>
        
        <div style="text-align: left; max-width: 480px; margin: 10px auto; color: #aaa; font-size: 0.9rem; line-height: 1.4;">
            Plataforma de análisis forense sugerida: 
            <a href="https://exif.tools/exiftool" target="_blank" style="color: #00FF41; font-weight: bold; text-decoration: underline;">https://exif.tools/exiftool</a><br>
            
        </div>
    `,

8: `
        <h1 class="glitch" data-text="PHASE 08: RF SIGNAL DEMODULATION">PHASE 08: RF SIGNAL DEMODULATION</h1>
        <p>Hemos sintonizado una antena de software definido (SDR) en la frecuencia central de la telemetría del núcleo.</p>
        
        <div style="background: #020202; border: 1px solid #00FF41; padding: 10px; font-family: monospace; text-align: left; font-size: 0.85rem; max-height: 220px; overflow-y: auto;">
            <p style="color: #ffff00; margin: 0 0 10px 0;">[ SDR SPECTRUM CAPTURE - FREQ: 433.920 MHz - MOD: OOK ]</p>
            <span style="color: #555;">TIME | SPECTRUM WATERFALL</span><br>
            <span style="color: #666;">------------------------------------------------</span><br>
            0.1s | <span style="color: #00FF41;">████████████</span>                      [CH 1: HIGH]<br>
            0.2s | <span style="color: #333;">............</span>                      [CH 1: LOW]<br>
            0.3s | <span style="color: #00FF41;">████████████</span>                      [CH 1: HIGH]<br>
            0.4s | <span style="color: #00FF41;">████████████</span>                      [CH 1: HIGH]<br>
            0.5s | <span style="color: #333;">............</span>                      [CH 1: LOW]<br>
            0.6s | <span style="color: #333;">............</span>                      [CH 1: LOW]<br>
            0.7s | <span style="color: #00FF41;">████████████</span>                      [CH 1: HIGH]<br>
            0.8s | <span style="color: #333;">............</span>                      [CH 1: LOW]<br>
            <span style="color: #666;">------------------------------------------------</span><br>
            <p style="margin: 5px 0 0 0; color: #aaa; font-size: 0.8rem;">[INFO] Modulación digital por ancho de pulso detectada. Estructura de ráfaga completa.</p>
        </div>

        <p><strong>MISSION:</strong> Demodula la señal digital. Un bloque lleno <code>████</code> equivale a un bit en estado alto (<code>1</code>) y una línea de puntos <code>....</code> equivale a un bit en estado bajo (<code>0</code>). Traduce el byte de 8 bits resultante de binario a texto.</p>
        
        <p style="color: #555; font-size: 0.8rem;">(Pista: El orden de los tiempos va de 0.1s a 0.8s. Puedes usar CyberChef con la receta 'From Binary' para revelar el caracter oculto de la bandera).</p>
    `,
    
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
        gameState.level++;
        localStorage.setItem('nexus_level', gameState.level);
        
        setTimeout(() => {
            document.getElementById('flag-input').value = '';
            msg.innerHTML = '';
            loadLevel(gameState.level); // Carga el siguiente nivel
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

// ==========================================
// LÓGICA DEL NIVEL 4: MANIPULACIÓN DEL DOM
// ==========================================
function checkDOMPrivilege() {
    const roleInput = document.getElementById('role-lock');
    const status = document.getElementById('dom-status');
    
    // Leemos directamente el valor que tenga la caja de texto en ese instante
    const currentValue = roleInput.value.trim().toLowerCase();
    
    if (currentValue === "admin") {
        status.style.color = "#00FF41";
        status.innerHTML = `
            <p>[ ESCALACIÓN EXITOSA - CONFIGURACIÓN CORONADA ]</p>
            <p style="color: white; border: 1px dashed #00FF41; padding: 10px; display: inline-block; background: #050505;">
                FLAG_04: USTA(D0M_M4N1PUL4T0R)
            </p>
        `;
    } else {
        status.style.color = "#ff003c";
        status.innerHTML = `[ ERROR ] El rango '${roleInput.value}' no tiene autorización. Cambia el valor a 'admin'.`;
    }
}

// ==========================================
// LÓGICA DEL NIVEL 6: ping
// ==========================================

function executePingTool() {
    const query = document.getElementById('ping-input').value.trim().toLowerCase();
    const output = document.getElementById('ping-output');
    
    if (!query) {
        output.innerHTML = "Error: IP string cannot be empty.";
        return;
    }
    
    output.innerHTML = "Executing ping command on remote host...\n";
    
    setTimeout(() => {
        // Caso 1: El estudiante logra listar los archivos (ls)
        if ((query.includes(';') || query.includes('&&')) && query.includes('ls')) {
            output.innerHTML = `PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.\n\n--- ARCHIVOS ENCONTRADOS EN EL DIRECTORIO ---\nbackup.log\nserver.js\nflag_secret.txt\nindex.html`;
        } 
        // Caso 2: El estudiante lee el archivo de la bandera (cat flag_secret.txt)
        else if ((query.includes(';') || query.includes('&&')) && query.includes('cat') && query.includes('flag_secret.txt')) {
            // AQUÍ INYECTAMOS LA NUEVA BANDERA
            output.innerHTML = `--- RELEYENDO ARCHIVO: flag_secret.txt ---\n\n[SUCCESS] Contenido del archivo:\nUSTA(CMD_1NJ_3XPL01T)`;
        } 
        // Caso 3: Un ping común y corriente sin hackear
        else {
            output.innerHTML = `PING ${query} (RAW_HOST) 56(84) bytes of data.\n\n--- ${query} ping statistics ---\n1 packets transmitted, 1 received, 0% packet loss.`;
        }
    }, 800);
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