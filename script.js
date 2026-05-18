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
        "49578f80083b8c704fc4fb2c84cb90707f281bedc8c9ef5c646fa384def863be", // Hash del nivel 8
        "3362880e4c7b5ecabd696c7c8cd9dc85970feda92a1db8e86db95f9b3d5df686", // Hash del nivel 9
        "46abcb5231250de7b47af1e5ebcedca29e20b640b721e191aa1924e3346f2cad", // Hash del nivel 10

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
        <h1 class="glitch" data-text="FASE 01: RECONOCIMIENTO">FASE 01: RECONOCIMIENTO</h1>
        <p>Identidad del sistema confirmada. Punto de entrada detectado con éxito.</p>
        
        <div style="background: rgba(0, 255, 65, 0.03); border-left: 3px solid #00FF41; padding: 10px; margin: 15px 0; font-size: 0.85rem; text-align: left; line-height: 1.4;">
            <span style="color: #00FF41; font-weight: bold;">[ AUDITORÍA REQUERIDA ]:</span> 
            Exposición de información en comentarios HTML. Ocurre cuando un desarrollador deja notas o credenciales de prueba olvidadas en el código. Un atacante solo inspecciona la estructura para descubrir secretos expuestos.
        </div>

        <p><strong>MISIÓN:</strong> Inspecciona la base de esta interfaz para encontrar el código de desvío.</p>
        <p style="color: #555; font-size: 0.85rem;">(Pista: Abre F12 y busca entre los comentarios ocultos del código fuente).</p>
    `,

  2: `
        <h1 class="glitch" data-text="FASE 02: ARCHIVOS EXPUESTOS">FASE 02: ARCHIVOS EXPUESTOS</h1>
        <p>Acceso concedido. Estás dentro del perímetro del directorio raíz del servidor.</p>
        
        <div style="background: rgba(0, 255, 65, 0.03); border-left: 3px solid #00FF41; padding: 10px; margin: 15px 0; font-size: 0.85rem; text-align: left; line-height: 1.4;">
            <span style="color: #00FF41; font-weight: bold;">[ AUDITORÍA REQUERIDA ]:</span> 
            Exposición de archivos sensibles. Ocurre cuando se suben respaldos (.txt, .bak, .zip) a la producción de la web. Un atacante no necesita vulnerar el backend; solo rastrea o adivina el nombre del archivo en la URL para extraer datos confidenciales.
        </div>

        <div style="background: rgba(0, 255, 65, 0.05); border: 1px dashed #00FF41; padding: 12px; margin: 15px 0; font-size: 0.9rem;">
            <p style="color: #00FF41; font-weight: bold; margin: 0 0 8px 0;">[ ALERTA DE INTELIGENCIA ]</p>
            <p style="margin: 0 0 8px 0;">Solo uno de los siguientes archivos contiene la tabla de ruteo real. Los otros son señuelos (Honeypots):</p>
            <ul style="line-height: 1.5; color: white; margin: 0; padding-left: 20px; text-align: left;">
                <li><code>/stick/falg.html</code></li>
                <li><code>/backup.txt</code></li>
                <li><code>/dont_open.txt</code></li>
            </ul>
        </div>

        <p><strong>MISIÓN:</strong> Prueba los archivos directamente en la URL de tu navegador (ejemplo: cambiar <code>/index.html</code> por <code>/backup.txt</code>). Encuentra el correcto para hallar la compuerta secreta.</p> 
    `,

   3: `
        <h1 class="glitch" data-text="FASE 03: INTERCEPTACIÓN">FASE 03: INTERCEPTACIÓN</h1>
        <p>Excelente. Ya sabes mapear la estructura visible del servidor web.</p>
        
        <div style="background: rgba(0, 255, 65, 0.03); border-left: 3px solid #00FF41; padding: 10px; margin: 15px 0; font-size: 0.85rem; text-align: left; line-height: 1.4;">
            <span style="color: #00FF41; font-weight: bold;">[ AUDITORÍA REQUERIDA ]:</span> 
            Fuga de datos en cabeceras HTTP inseguras. Ocurre cuando la aplicación envía tokens ocultos en las peticiones de red de fondo (AJAX/Fetch). Un analista intercepta este tráfico para extraer credenciales sin tocar el backend.
        </div>

        <p><strong>MISIÓN:</strong> El código no está en el texto de la página; viaja en el tráfico de red.</p>
        
        <p style="color: #ffff00; font-size: 0.9rem;">
            <strong>TAREA:</strong> Abre <strong>F12</strong> → pestaña <strong>Red (Network)</strong> → busca la petición <strong>"auth_check"</strong> (si no sale nada reinicia la pagina) → examina los <strong> tokens (Headers)</strong>.
        </p>
    `,
   4: `
        <h1 class="glitch" data-text="FASE 04: ESCALACIÓN DE PRIVILEGIOS">FASE 04: ESCALACIÓN DE PRIVILEGIOS</h1>
        <p>El sistema identifica tu rango actual mediante una variable bloqueada en la interfaz gráfica de usuario.</p>
        
        <div style="background: rgba(0, 255, 65, 0.03); border-left: 3px solid #00FF41; padding: 10px; margin: 15px 0; font-size: 0.85rem; text-align: left; line-height: 1.4;">
            <span style="color: #00FF41; font-weight: bold;">[ AUDITORÍA REQUERIDA ]:</span> 
            Manipulación del DOM (Client-Side Trust). Ocurre cuando el sistema confía ciegamente en las restricciones del lado del cliente (como el atributo <code>disabled</code>). Un atacante altera el código directamente en su navegador para saltarse las reglas de la interfaz.
        </div>

        <div style="border: 1px dashed #00FF41; padding: 12px; margin: 15px 0; background: rgba(0,0,0,0.3); font-size: 0.9rem;">
            <p style="margin: 0 0 8px 0; color: #aaa;">[ CONTROL DE ACCESO LOCAL ]</p>
            <label>Rango Asignado: </label>
            <input type="text" id="role-lock" value="guest" disabled 
                style="background: #222; color: #ff003c; border: 1px solid #ff003c; padding: 5px; text-align: center; font-weight: bold; font-family: monospace;">
        </div>

        <p><strong>MISIÓN:</strong> El botón de abajo lee el valor de esa caja que dice <code>guest</code>. Sigue estos pasos exactos para hackear el sistema:</p>
        
        <div style="color: #ffff00; font-size: 0.9rem; margin: 10px 0; text-align: left; line-height: 1.5;">
            1. Abre el Inspector de elementos presionando <strong>F12</strong>.<br>
            2. Selecciona la caja de texto que dice <strong>"guest"</strong> en la pantalla.<br>
            3. Modifica el texto borrando <strong>"guest"</strong> y escribe la palabra <strong>"admin"</strong> para subir tus privilegios a administrador.<br>
            4. Por último, dale clic al botón de abajo para enviar la petición de rango y obtener tu bandera.
        </div>
        
        <button onclick="checkDOMPrivilege()" style="background: #00FF41; color: black; border: none; padding: 8px 15px; cursor: pointer; font-family: monospace; font-weight: bold; margin-top: 10px;">
            [ ENVIAR PETICIÓN DE RANGO ]
        </button>
        
        <div id="dom-status" style="margin-top: 15px; font-weight: bold;"></div>
    `,
        
 5: `
        <h1 class="glitch" data-text="FASE 05: TRANSMISIÓN CODIFICADA">FASE 05: TRANSMISIÓN CODIFICADA</h1>
        <p>Has activado una alarma interna. El sistema está transmitiendo una baliza de emergencia hacia el núcleo principal.</p>
        
        <div style="background: rgba(0, 255, 65, 0.03); border-left: 3px solid #00FF41; padding: 10px; margin: 15px 0; font-size: 0.85rem; text-align: left; line-height: 1.4;">
            <span style="color: #00FF41; font-weight: bold;">[ AUDITORÍA REQUERIDA ]:</span> 
            Uso de codificación en lugar de cifrado real (Obfuscation vs Encryption). Ocurre cuando se confunde empaquetar datos en formatos como Base64 con protegerlos. Cualquiera puede revertir la codificación de inmediato sin necesidad de una llave secreta.
        </div>

        <div style="background: rgba(0,20,0,0.5); border: 1px dashed #00FF41; padding: 12px; margin: 15px 0; text-align: center;">
            <p style="color: #ff003c; font-weight: bold; margin: 0 0 8px 0;">[ TRANSMISIÓN DE DATOS INTERCEPTADA ]</p>
            <code style="color: white; font-size: 1.1rem; letter-spacing: 1px; font-family: monospace;">VlZOVVFTaERNVkJvUlZKZlRUUlRWRE5TS1E9PQ==</code>
        </div>

        <p><strong>MISIÓN:</strong> Descodifica la carga útil (payload) interceptada. Sigue este protocolo:</p>
        
        <div style="color: #21d309; font-size: 0.9rem; margin: 10px 0; text-align: left; line-height: 1.5;">
            1. Copia la cadena de texto blanca que está dentro del recuadro de arriba y usa una herramienta de decodificado como la que usastes en el paso 2.<br>
            
            
        </div>
    `,
    
6: `
        <h1 class="glitch" data-text="FASE 06: INYECCIÓN DE COMANDOS">FASE 06: INYECCIÓN DE COMANDOS</h1>
        <p>Hemos tomado el control de una interfaz de consola remota que interactúa directamente con el sistema operativo del servidor central.</p>
        
        <div style="background: rgba(0, 255, 65, 0.03); border-left: 3px solid #00FF41; padding: 10px; margin: 15px 0; font-size: 0.85rem; text-align: left; line-height: 1.4;">
            <span style="color: #00FF41; font-weight: bold;">[ AUDITORÍA REQUERIDA ]:</span> 
            Inyección de comandos del Sistema Operativo (OS Command Injection). Ocurre cuando una aplicación web permite ejecutar comandos directamente en la terminal del backend sin sanitizar. Un atacante aprovecha esto para explorar carpetas, leer archivos confidenciales o comprometer el servidor.
        </div>

        <div style="border: 1px solid #00FF41; padding: 12px; margin: 15px 0; background: #020202;">
            <p style="color: #00FF41; margin-top: 0; font-family: monospace;">[ NEXUS TERMINAL INTERACTION v1.0 ]</p>
            <label style="font-family: monospace;">$ </label>
            <input type="text" id="ping-input" placeholder="ej. ls" 
                style="background: #111; color: #00FF41; border: 1px solid #00FF41; padding: 5px; font-family: monospace; width: 220px;">
            <button onclick="executePingTool()" style="background: #00FF41; color: black; border: none; padding: 5px 10px; cursor: pointer; font-family: monospace; font-weight: bold;">
                [ EJECUTAR ]
            </button>
            <pre id="ping-output" style="margin-top: 15px; color: #aaa; background: #000; padding: 10px; border: 1px solid #333; font-size: 0.85rem; text-align: left; max-height: 150px; overflow-y: auto; font-family: monospace;"></pre>
        </div>

        <p><strong>MISIÓN:</strong> Usa comandos de consola como  para explorar el servidor y encontrar la bandera. Sigue estos pasos:</p>
          <p style="color: #555; font-size: 0.85rem;">(Pista: usa los comando ls para buscar los archivos del servidor y cat para leerlos, la sitaxis de cat es cat archivo.pdf).</p>
   
    `,

  7: `
        <h1 class="glitch" data-text="FASE 07: ANÁLISIS FORENSE">FASE 07: ANÁLISIS FORENSE</h1>
        <p>Una imagen dice más que mil palabras... y a veces, guarda secretos que no se ven a simple vista.</p>
        
        <div style="background: rgba(0, 255, 65, 0.03); border-left: 3px solid #00FF41; padding: 10px; margin: 15px 0; font-size: 0.85rem; text-align: left; line-height: 1.4;">
            <span style="color: #00FF41; font-weight: bold;">[ AUDITORÍA REQUERIDA ]:</span> 
            Esteganografía y análisis forense digital. Ocurre cuando se oculta información confidencial dentro de archivos multimedia legítimos para evadir los controles de seguridad o transmitir datos en cubierto.
        </div>

        <div style="text-align: center; margin: 20px 0; border: 1px dashed #00FF41; padding: 15px; background: rgba(0,0,0,0.3);">
            <p style="color: #ffff00; margin-top: 0; font-family: monospace;">[ DETECTADO: ARCHIVO_SOSPECHOSO.PNG ]</p>
            
            <img src="Iwa64n_(4Yu_FI46.png" alt="Blueprint" style="width: 150px; border: 1px solid #333; margin-bottom: 15px; cursor: pointer;" onclick="window.open('Iwa64n_(4Yu_FI46.png', '_blank')">
            <br>
            
            <a href="Iwa64n_(4Yu_FI46.png" download style="background: transparent; color: #00FF41; border: 1px dashed #00FF41; padding: 8px 15px; cursor: pointer; font-family: monospace; font-weight: bold; text-decoration: none; display: inline-block; font-size: 0.85rem;">
                [ DESCARGAR ARCHIVO: Iwa64n_(4Yu_FI46.png ]
            </a>
        </div>

        <p><strong>MISIÓN:</strong> El token de acceso está escondido en este archivo. Puede que esté directamente dibujado en la foto... o tal vez oculto muy profundamente dentro de los metadatos de la imagen... quién sabe, tal vez esté por ahí... </p>
        
        <p style="color: #aaa; font-size: 0.85rem;">
            Plataforma de análisis forense sugerida: 
            <a href="https://exif.tools/exiftool" target="_blank" style="color: #00FF41; font-weight: bold; text-decoration: underline;">https://exif.tools/exiftool</a>
        </p>
    `,
8: `
        <h1 class="glitch" data-text="FASE 08: EXTRACCIÓN DE CREDENCIALES">FASE 08: EXTRACCIÓN DE CREDENCIALES</h1>
        <p>Hemos interceptado el portal de acceso del panel central. Tu objetivo no es adivinar la clave, sino romper la base de datos para extraer el nombre del usuario administrador.</p>
        
        <div style="background: rgba(0, 255, 65, 0.03); border-left: 3px solid #00FF41; padding: 10px; margin: 15px 0; font-size: 0.85rem; text-align: left; line-height: 1.4;">
            <span style="color: #00FF41; font-weight: bold;">[ AUDITORÍA REQUERIDA ]:</span> 
            Inyección SQL (Bypass de Autenticación). Ocurre cuando un formulario web concatena las entradas del usuario directamente en las consultas SQL sin filtrar. Al inyectar lógica condicional verdadera, podemos saltarnos la validación y obligar al sistema a revelar información interna.
        </div>

        <div style="border: 1px solid #00FF41; padding: 15px; margin: 15px 0; background: #020202; max-width: 300px; margin-left: auto; margin-right: auto; text-align: left;">
            <p style="color: #00FF41; margin-top: 0; font-family: monospace; text-align: center;">[ AUTENTICACIÓN CONTROL CENTRAL ]</p>
            
            <div style="margin-bottom: 10px;">
                <label style="font-family: monospace; display: block; margin-bottom: 3px;">Usuario:</label>
                <input type="text" id="sql-user" placeholder="ej. admin" 
                    style="background: #111; color: #00FF41; border: 1px solid #00FF41; padding: 5px; font-family: monospace; width: 93%;">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="font-family: monospace; display: block; margin-bottom: 3px;">Contraseña:</label>
                <input type="password" placeholder="******" disabled
                    style="background: #222; color: #555; border: 1px solid #333; padding: 5px; font-family: monospace; width: 93%; cursor: not-allowed;">
            </div>
            
            <button onclick="executeSQLAuth()" style="background: #00FF41; color: black; border: none; padding: 8px 15px; cursor: pointer; font-family: monospace; font-weight: bold; width: 100%;">
                [ VALIDAR ACCESO ]
            </button>
            
            <div id="sql-output" style="margin-top: 15px; font-size: 0.85rem; font-family: monospace; text-align: center; font-weight: bold;"></div>
        </div>

        <p><strong>MISIÓN:</strong> Manipula el campo de <strong>Usuario</strong> inyectando la instrucción lógica clásica <code>' OR '1'='1</code> para vulnerar el inicio de sesión y forzar al sistema a escupir el usuario oculto.</p>
        <p style="color: #ffff00; font-size: 0.85rem;">⚠️ (Nota: El usuario que obtengas ES tu bandera de este nivel. Introdúcelo en el validador global para avanzar y guárdalo muy bien, lo vas a necesitar en la Fase 9).</p>
    `,

9: `
        <h1 class="glitch" data-text="FASE 09: ACCESO AL MAINFRAME">FASE 09: ACCESO AL MAINFRAME</h1>
        <p>Estás frente a la puerta del servidor intermedio. Para entrar, debes loguearte con el usuario que descubriste en la Fase 8 y la contraseña oculta en la memoria RAM.</p>
        
        <div style="background: rgba(0, 255, 65, 0.03); border-left: 3px solid #00FF41; padding: 10px; margin: 15px 0; font-size: 0.85rem; text-align: left; line-height: 1.4;">
            <span style="color: #00FF41; font-weight: bold;">[ AUDITORÍA REQUERIDA ]:</span> 
            Fuga de Información en Memoria (Volcado de RAM). Ocurre cuando los procesos del sistema operativo escriben variables temporales o credenciales en texto plano dentro de la memoria volátil. Si un analista intercepta este flujo, puede capturar datos activos de la sesión.
        </div>

        <div style="border: 1px dashed #ff003c; padding: 10px; margin-bottom: 20px; background: #020202; font-family: monospace;">
            <p style="color: #ff003c; margin-top: 0; text-align: center; font-weight: bold;">[ ESCÁNER DE VOLUMEN VOLÁTIL RAM ]</p>
            <button onclick="executeRAMScan()" style="background: #ff003c; color: white; border: none; padding: 6px 12px; cursor: pointer; font-family: monospace; font-weight: bold; display: block; margin: 0 auto 10px auto;">
                [ INTERCEPTAR FLUJO DE RAM ]
            </button>
            <pre id="ram-output" style="margin: 0; color: #555; background: #000; padding: 8px; border: 1px solid #222; font-size: 0.8rem; text-align: left; max-height: 120px; overflow-y: auto; white-space: pre-wrap; line-height: 1.3;">[SISTEMA EN ESPERA] Ejecuta el escáner para ver los strings en vivo...</pre>
        </div>

        <div style="border: 2px solid #ff003c; padding: 15px; margin: 15px 0; background: #0a0002; max-width: 320px; margin-left: auto; margin-right: auto; text-align: left; box-shadow: 0 0 10px rgba(255,0,60,0.2);">
            <p style="color: #ff003c; margin-top: 0; font-family: monospace; text-align: center; font-weight: bold;">[ MAINFRAME SECURE GATEWAY ]</p>
            
            <div style="margin-bottom: 10px;">
                <label style="font-family: monospace; display: block; margin-bottom: 3px; color: #aaa;">Admin User:</label>
                <input type="text" id="ram-user" placeholder="Pega el usuario de la Fase 8" 
                    style="background: #150005; color: white; border: 1px solid #ff003c; padding: 5px; font-family: monospace; width: 93%;">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="font-family: monospace; display: block; margin-bottom: 3px; color: #aaa;">Access PIN:</label>
                <input type="text" id="ram-pass" placeholder="Busca el número en la RAM" 
                    style="background: #150005; color: white; border: 1px solid #ff003c; padding: 5px; font-family: monospace; width: 93%;">
            </div>
            
            <button onclick="executeRAMAuth()" style="background: #ff003c; color: white; border: none; padding: 8px 15px; cursor: pointer; font-family: monospace; font-weight: bold; width: 100%;">
                [ DESBLOQUEAR NÚCLEO ]
            </button>
            
            <div id="ram-auth-output" style="margin-top: 15px; font-size: 0.85rem; font-family: monospace; text-align: center; font-weight: bold;"></div>
        </div>

        <p><strong>MISIÓN:</strong> Corre el interceptor de RAM, afina el ojo entre las líneas para capturar la contraseña numérica y pégala junto al usuario del nivel anterior en el <strong>Mainframe Secure Gateway</strong> para forzar la entrada.</p>
    `,
    
10: `
        <h1 class="glitch" data-text="FASE 10: APAGADO DE EMERGENCIA">FASE 10: APAGADO DE EMERGENCIA</h1>
        <p style="color: #ff003c; font-weight: bold; animation: blink 1s infinite;">[ ALERTA MÁXIMA: PROTOCOLO DE DESTRUCCIÓN GLOBAL ACTIVO ]</p>
        
        <div style="background: rgba(255, 0, 60, 0.03); border-left: 3px solid #ff003c; padding: 10px; margin: 15px 0; font-size: 0.85rem; text-align: left; line-height: 1.4;">
            <span style="color: #ff003c; font-weight: bold;">[ ANÁLISIS DE AMENAZA ]:</span> 
            Manipulación del DOM (Client-Side Trust). El botón de autodestrucción ha sido bloqueado desde el lado del cliente usando el atributo HTML 'disabled'. Debes alterar el código fuente en vivo en tu navegador para rehabilitar el mecanismo.
        </div>

        <div id="phase10-container" style="border: 2px solid #ff003c; padding: 15px; margin: 15px 0; background: #050000; font-family: monospace; text-align: center; position: relative; overflow: hidden;">
            
            <div id="lockout-overlay" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(5,0,0,0.95); z-index: 10; align-items: center; justify-content: center; flex-direction: column;">
                <h2 style="color: #ff003c; margin: 0 0 10px 0;">[ SISTEMA BLOQUEADO ]</h2>
                <p style="color: #aaa; margin: 0 0 10px 0;">Amonestación de seguridad por lentitud.</p>
                <p style="color: #aaa; margin: 0 0 5px 0;">Tiempo de penalización restante:</p>
                <div id="lockout-timer" style="font-size: 2rem; color: #ff003c; font-weight: bold;">02:00</div>
            </div>

            <p style="color: #ff003c; font-size: 1.1rem; margin: 0 0 5px 0; font-weight: bold;">TIEMPO RESTANTE PARA EL IMPACTO</p>
            <div id="countdown-timer" style="font-size: 2.5rem; color: #ff003c; font-weight: bold; font-family: monospace; letter-spacing: 2px;">01:00</div>
            
            <button id="sync-btn" style="background: #ff003c; color: white; border: none; padding: 6px 15px; cursor: pointer; font-family: monospace; font-weight: bold; margin-top: 10px;">
                [ INICIAR SECUENCIA ]
            </button>

            <div style="margin-top: 20px; border-top: 1px dashed #ff003c; padding-top: 15px;">
                <button id="kill-switch-btn" disabled style="background: #222; color: #555; border: 1px solid #ff003c; padding: 12px 30px; font-size: 1.2rem; cursor: not-allowed; font-family: monospace; font-weight: bold;">
                    [ INDUCIR SOBRECARGA Y APAGAR CONFIGURACIÓN ]
                </button>
            </div>
        </div>

        <p><strong>MISIÓN FINAL:</strong> El botón de autodestrucción está inhabilitado. Inicia la secuencia para activar el reloj. Luego abre el Inspector (<strong>F12</strong>), localiza el botón con el ID <code>kill-switch-btn</code>, <strong>elimina la palabra disabled</strong> de su código para revivirlo, y presiónalo antes de que el tiempo llegue a cero.</p>
        
        <style>
            @keyframes blink { 50% { opacity: 0; } }
            @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        </style>
    `,
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
    }
    
    if (levelNum === 4) {
        if (!document.cookie.includes("user_role=")) {
            document.cookie = "user_role=guest; path=/; SameSite=Lax";
            console.log("Cookie user_role=guest generada automáticamente.");
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
// ANIMACIÓN DE FONDO (MATRIX RAIN)
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

// ==========================================
// LÓGICA DEL NIVEL 3
// ==========================================
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
// (ya integrado dentro de loadLevel)

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
        output.innerHTML = "Error: La línea de comando no puede estar vacía.";
        return;
    }
    
    output.innerHTML = "$ " + query + "\nEjecutando comando en el servidor remoto...\n";
    
    setTimeout(() => {
        // Paso 1: El estudiante escribe exactamente "ls"
        if (query === 'ls') {
            output.innerHTML = `root@nexus-server:~$ ls\nbackup.log\nserver.js\nflag_secret.txt\nindex.html`;
        } 
        // Paso 2: El estudiante escribe exactamente "cat flag_secret.txt"
        else if (query === 'cat flag_secret.txt') {
            output.innerHTML = `root@nexus-server:~$ cat flag_secret.txt\n\n[SUCCESS] Contenido del archivo encontrado:\nUSTA(CMD_1NJ_3XPL01T)`;
        } 
        // Caso de ayuda por si escribe cat solo
        else if (query === 'cat') {
            output.innerHTML = `root@nexus-server:~$ cat\nError: el comando 'cat' requiere el nombre del archivo. Ejemplo: cat flag_secret.txt`;
        }
        // Si escribe cualquier otra burrada
        else {
            output.innerHTML = `root@nexus-server:~$ ${query}\nbash: ${query}: comando no reconocido. Intenta usando 'ls' para ver los archivos o 'cat [archivo]' para leerlos.`;
        }
    }, 600);
}

// ==========================================
// LÓGICA DEL NIVEL 8
// ==========================================

function executeSQLAuth() {
    const user = document.getElementById('sql-user').value.trim();
    const output = document.getElementById('sql-output');
    
    if (!user) {
        output.style.color = "#ff003c";
        output.innerHTML = "Error: El campo usuario no puede estar vacío.";
        return;
    }
    
    // Validamos que usen la inyección clásica
    if (user.includes("' or") || user.includes("' OR") || user.includes("'oR") || user.includes("'Or")) {
        output.style.color = "#00FF41";
        output.innerHTML = `
            <p style="margin: 5px 0;">[ SQLi BYPASS SUCCESS ]</p>
            <div style="color: white; font-weight: normal; font-size: 0.8rem; background: #111; padding: 6px; border: 1px dashed #00FF41; margin-top: 5px;">
                Usuario de la Central Encontrado:<br>
                <strong style="color: #00FF41; font-size: 1rem;">USTA(N3XUS_4DM1N)</strong>
            </div>
        `;
    } else {
        output.style.color = "#ff003c";
        output.innerHTML = "Error: Usuario o contraseña incorrectos.";
    }
}

// ==========================================
// LÓGICA DEL NIVEL 9
// ==========================================
// Simulación de Escaneo de Memoria RAM en Vivo
function executeRAMScan() {
    const output = document.getElementById('ram-output');
    output.style.color = "#44aa44";
    output.innerHTML = "Sincronizando frecuencias...\n[+] Conectando al bus de datos de la memoria RAM...\n[+] Volcado en progreso (Leyendo direcciones hexadecimales):\n\n";
    
    let lines = [
        "0x7FFF3A10 | MEM_ALLOC: proc_kernel_init() - STATUS: OK",
        "0x7FFF3A2C | TRÁFICO_RED: yo deberia estar durmiendo - ADDR: 192.168.1.5",
        "0x7FFF3A48 | MONITOREO: CPU Temp 47°C | Fan Speed 2400 RPM",
        "0x7FFF3A64 | COMPU_LOG: SESIÓN ACTIVA DETECTADA -> [User: N3XUS_4DM1N]",
        "0x7FFF3A80 | STRING_STACK: PASSWORD_PIN -> 7492",
        "0x7FFF3AB6 | SYS_ALERT: subsidien los tokens por favor o paila",
        "0x7FFF3B12 | MEM_ALLOC: clearing_cache_buffer... success",
        "0x7FFF3B3A | SISTEMA: esperando que me den nota por hacer esto...",
        "0x7FFF3B58 | SYS_LOG: conexion_finalizada_correctamente"
    ];
    
    let index = 0;
    const interval = setInterval(() => {
        if (index < lines.length) {
            // Camuflaje sutil de las líneas clave
            if (lines[index].includes("7492") || lines[index].includes("N3XUS_4DM1N")) {
                output.innerHTML += `<span style="color: #c5c58d; font-weight: bold;">${lines[index]}</span>\n`;
            } else {
                output.innerHTML += `<span style="color: #555555;">${lines[index]}</span>\n`;
            }
            output.scrollTop = output.scrollHeight;
            index++;
        } else {
            clearInterval(interval);
        }
    }, 300);
}
function executeRAMAuth() {
    const userInput = document.getElementById('ram-user').value.trim();
    const passInput = document.getElementById('ram-pass').value.trim();
    const output = document.getElementById('ram-auth-output');
    
    if (!userInput || !passInput) {
        output.style.color = "#ff003c";
        output.innerHTML = "[ ERROR: Campos incompletos. ]";
        return;
    }
    
    // Validamos que use el usuario del paso 8 y la clave del paso 9
    if (userInput === 'N3XUS_4DM1N' && passInput === '7492') {
        output.style.color = "#00FF41";
        output.innerHTML = `
            <p style="margin: 5px 0;">[ PORTAL DESBLOQUEADO ]</p>
            <div style="color: white; font-weight: normal; font-size: 0.8rem; background: #000; padding: 6px; border: 1px dashed #00FF41; margin-top: 5px;">
                Token de Validación del Nivel 9:<br>
                <strong style="color: #00FF41; font-size: 0.95rem;">USTA(RAM_L34K_7492)</strong>
            </div>
        `;
    } else {
        output.style.color = "#ff003c";
        output.innerHTML = "[ ACCESO DENEGADO: Credenciales incorrectas. ]";
    }
}

// ==========================================
// LÓGICA DEL NIVEL 10
// ==========================================

// Variables de control de tiempo
let phase10Timeout;
let checkDisabledInterval;
let lockoutIntervalKey;

// RECEPTOR GLOBAL DE CLICS: Resuelve el error de Scope de los elementos inyectados
document.addEventListener('click', function (event) {
    // Si dan clic en el botón de iniciar secuencia
    if (event.target && event.target.id === 'sync-btn') {
        executeAlternativeTimer();
    }
    // Si dan clic en el botón de destrucción final
    if (event.target && event.target.id === 'kill-switch-btn' && event.target.getAttribute('data-armed') === 'true') {
        executeFinalExplosionAlternative();
    }
});

// Función Alternativa del Cronómetro (Evita congelamientos)
function executeAlternativeTimer() {
    const syncBtn = document.getElementById('sync-btn');
    const timerDisplay = document.getElementById('countdown-timer');
    const killBtn = document.getElementById('kill-switch-btn');
    
    if (syncBtn) syncBtn.style.display = 'none';
    
    let duration = 60; // 60 segundos totales
    let startTime = Date.now();
    
    // Escáner en segundo plano: cambia el diseño del botón apenas el estudiante borre "disabled"
    clearInterval(checkDisabledInterval);
    checkDisabledInterval = setInterval(() => {
        if (killBtn && !killBtn.hasAttribute('disabled') && killBtn.getAttribute('data-armed') !== 'true') {
            // Fuerza la habilitación real del botón via JS (por si el navegador no sincronizó)
            killBtn.disabled = false;
            killBtn.setAttribute('data-armed', 'true');
            killBtn.style.background = "#00FF41";
            killBtn.style.color = "black";
            killBtn.style.cursor = "pointer";
            killBtn.style.boxShadow = "0 0 15px #00FF41";
            killBtn.style.animation = "pulse 1s infinite";
            clearInterval(checkDisabledInterval);
        }
    }, 250);

    // Bucle recursivo del segundero basado en tiempo real del sistema
    function tick() {
        let elapsed = Math.floor((Date.now() - startTime) / 1000);
        let remaining = duration - elapsed;

        if (remaining <= 0) {
            if (timerDisplay) timerDisplay.innerHTML = "SYSTEM OVERRIDE - CONTROL TOTAL PERDIDO";
            clearInterval(checkDisabledInterval);
            executeAlternativeLockout(); // Cae la amonestación
            return;
        }

        let secondsStr = remaining < 10 ? '0' + remaining : remaining;
        if (timerDisplay) {
            timerDisplay.innerHTML = `00:${secondsStr}`;
            if (remaining <= 10) {
                timerDisplay.style.color = "#ff0000"; // Alerta roja visual
            }
        }

        phase10Timeout = setTimeout(tick, 1000);
    }

    clearTimeout(phase10Timeout);
    tick();
}

// Mecanismo de Amonestación Absoluto (2 Minutos de bloqueo real)
function executeAlternativeLockout() {
    const overlay = document.getElementById('lockout-overlay');
    const lockoutDisplay = document.getElementById('lockout-timer');
    
    if (overlay) overlay.style.display = 'flex'; // Lanza la pantalla de bloqueo
    
    let lockoutDuration = 120; // 120 segundos = 2 minutos
    let lockStart = Date.now();
    
    clearInterval(lockoutIntervalKey);
    lockoutIntervalKey = setInterval(() => {
        let elapsed = Math.floor((Date.now() - lockStart) / 1000);
        let remaining = lockoutDuration - elapsed;
        
        if (remaining <= 0) {
            clearInterval(lockoutIntervalKey);
            // Al terminar la penalización, limpia el estado y deja reintentar
            if (overlay) overlay.style.display = 'none';
            const syncBtn = document.getElementById('sync-btn');
            const timerDisplay = document.getElementById('countdown-timer');
            if (syncBtn) syncBtn.style.display = 'inline-block';
            if (timerDisplay) {
                timerDisplay.innerHTML = '01:00';
                timerDisplay.style.color = '#ff003c';
            }
            return;
        }
        
        let mins = Math.floor(remaining / 60);
        let secs = remaining % 60;
        let minsStr = mins < 10 ? '0' + mins : mins;
        let secsStr = secs < 10 ? '0' + secs : secs;
        
        if (lockoutDisplay) lockoutDisplay.innerHTML = `${minsStr}:${secsStr}`;
    }, 1000);
}

// Pantalla de la Victoria Definitiva - Diseño Épico de Celebración
function executeFinalExplosionAlternative() {
    clearTimeout(phase10Timeout);
    clearInterval(checkDisabledInterval);
    
    const terminal = document.querySelector('.terminal-container') || document.body;
    
    // Efecto visual de cortocircuito (destello rápido)
    terminal.style.background = "#ff003c";
    
    setTimeout(() => {
        terminal.style.background = "#000000";
        
        // Apuntamos al contenedor principal de tu juego
        // NOTA: Usamos 'terminal-content' para sobreescribir la pantalla central respetando tu layout
        const content = document.getElementById('terminal-content');
        if (content) {
            content.innerHTML = `
                <div style="text-align: center; font-family: monospace; padding: 30px 15px; color: #00FF41;">
                    
                    <h1 class="glitch" data-text="[ CONEXIÓN FINALIZADA: VICTORIA ]" style="color: #00FF41; font-size: 2.2rem; margin-bottom: 5px; font-weight: bold; letter-spacing: 2px;">
                        [ CONEXIÓN FINALIZADA: VICTORIA ]
                    </h1>
                    <p style="color: #ff003c; font-weight: bold; margin-bottom: 25px; font-size: 1.1rem; letter-spacing: 1px;">
                        CRITICAL OVERLOAD: INFRAESTRUCTURA INHABILITADA CON ÉXITO
                    </p>
                    
                    <div style="max-width: 600px; margin: 0 auto; color: white; font-size: 1rem; line-height: 1.6; text-align: justify; background: rgba(0, 255, 65, 0.02); border: 1px solid #00FF41; padding: 20px; margin-bottom: 25px; box-shadow: 0 0 15px rgba(0, 255, 65, 0.1);">
                        <span style="color: #ffff00; font-weight: bold; display: block; margin-bottom: 10px; text-align: center; font-size: 1.2rem;">
                            ¡LO HAS CONSEGUIDO!
                        </span>
                        El ataque de resonancia masiva destruyó los buffers internos de la Base de Datos. Los sistemas de emisión global se encuentran apagados y la infraestructura central de la asociación malévola colapsó por completo de forma física. Las operaciones enemigas han quedado neutralizadas en su totalidad.
                    </div>
                    
                    <div style="border: 2px dashed #ff003c; padding: 15px; background: rgba(255,0,60,0.05); margin: 20px auto; max-width: 450px; text-align: center;">
                        <span style="color: #ff003c; font-weight: bold; font-size: 1.1rem; letter-spacing: 1px;">ESTADO DE LA RED MATRIX:</span><br>
                        <code style="color: white; font-size: 1.4rem; font-weight: bold; display: block; margin-top: 8px; letter-spacing: 2px;">
                            SISTEMA_OFFLINE
                        </code>
                    </div>
                    
                    <div style="margin-top: 30px; font-size: 0.85rem; color: #666; text-align: center; border-top: 1px solid #222; padding-top: 15px;">
                        <p style="margin: 0; color: #00FF41;">AUDITORÍA DE SEGURIDAD FINALIZADA EN REGLA</p>
                        <p style="margin: 5px 0 0 0;">Reporte técnico generado con éxito. Solicita la verificación presencial para asentar tu nota en el sistema.</p>
                    </div>

                </div>
            `;
            
            // Opcional: Si quieres ocultar el input de flags general de abajo para que la pantalla quede limpia
            const inputArea = document.querySelector('.input-area');
            if (inputArea) inputArea.style.display = 'none';
        }
    }, 150);
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