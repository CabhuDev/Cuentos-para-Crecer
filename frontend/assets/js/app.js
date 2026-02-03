/**
 * APP.JS - Lógica del Refugio
 * Maneja la seguridad, reproductor de audio y generador de diplomas
 */

console.log('🏡 [REFUGIO] Script cargado correctamente');

// ========================================
// 1. GATEKEEPER (Seguridad de Acceso)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 [REFUGIO] DOM cargado completamente');
    
    const acceso = localStorage.getItem('acceso_refugio_ok');
    const email = localStorage.getItem('usuario_email');
    
    console.log('🔐 [REFUGIO] Verificando acceso:', {
        acceso: acceso,
        email: email,
        tieneAcceso: acceso === 'true'
    });
    
    // Si no hay acceso, expulsar
    if (!acceso || acceso !== 'true') {
        console.warn('⚠️ [REFUGIO] Acceso denegado - redirigiendo a index.html');
        alert('🚫 Necesitas registrarte primero para acceder a los recursos');
        window.location.href = 'index.html';
        return;
    }
    
    console.log('✅ [REFUGIO] Acceso verificado correctamente');
    
    // Personalizar saludo
    if (email) {
        const userName = email.split('@')[0];
        const userNameElement = document.getElementById('user-name');
        console.log('👤 [REFUGIO] Personalizando saludo:', userName);
        if (userNameElement) {
            userNameElement.textContent = userName;
            console.log('✅ [REFUGIO] Saludo personalizado actualizado');
        } else {
            console.warn('⚠️ [REFUGIO] Elemento user-name no encontrado');
        }
    }
    
    // Inicializar el canvas del diploma
    console.log('🎨 [REFUGIO] Inicializando diploma...');
    inicializarDiploma();
});

// ========================================
// 2. GENERADOR DE DIPLOMAS (Canvas API)
// ========================================
function inicializarDiploma() {
    const canvas = document.getElementById('canvas-diploma');
    if (!canvas) {
        console.warn('⚠️ [REFUGIO] Canvas de diploma no encontrado en esta página');
        return;
    }
    
    console.log('✅ [REFUGIO] Canvas encontrado, dibujando diploma base...');
    const ctx = canvas.getContext('2d');
    
    // Dibujar plantilla base vacía
    ctx.fillStyle = '#F0F8FF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Borde decorativo
    ctx.strokeStyle = '#4A90E2';
    ctx.lineWidth = 20;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Título
    ctx.font = 'bold 50px Poppins';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('🏡 Diploma del Refugio', canvas.width / 2, 100);
    
    // Subtítulo
    ctx.font = '30px Poppins';
    ctx.fillStyle = '#666';
    ctx.fillText('Certificado de Amistad', canvas.width / 2, 160);
    
    // Texto inferior
    ctx.font = '20px Poppins';
    ctx.fillStyle = '#999';
    ctx.fillText('es ahora parte del Refugio de la Amistad', canvas.width / 2, 380);
    
    // Firma
    ctx.font = 'italic 24px Poppins';
    ctx.fillStyle = '#4A90E2';
    ctx.fillText('Cuentos para Crecer', canvas.width / 2, 520);
    
    // Decoraciones
    ctx.font = '60px Arial';
    ctx.fillText('⭐', 150, 500);
    ctx.fillText('⭐', canvas.width - 150, 500);
    
    console.log('✅ [REFUGIO] Diploma base dibujado correctamente');
}
function generarDiploma() {
    console.log('🎨 [REFUGIO] Generando diploma personalizado...');
    const canvas = document.getElementById('canvas-diploma');
    const ctx = canvas.getContext('2d');
    const nombreInput = document.getElementById('input-nombre');
    const diplomaContainer = document.getElementById('diploma-container');
    const nombreNino = nombreInput.value.trim();
    console.log('📝 [REFUGIO] Nombre introducido:', nombreNino);
    
    // Validación
    if (!nombreNino) {
        console.warn('⚠️ [REFUGIO] Nombre vacío, solicitando al usuario');
        alert('¡Escribe tu nombre primero! 😊');
        nombreInput.focus();
        return;
    }
    console.log('✅ [REFUGIO] Nombre válido, generando diploma...');
    
    // Mostrar contenedor del diploma
    if (diplomaContainer) {
        diplomaContainer.style.display = 'block';
        setTimeout(() => {
            diplomaContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
    
    // Reinicializar el canvas con diseño mejorado
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fondo degradado
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FFF9F5');
    gradient.addColorStop(0.5, '#F0F9F8');
    gradient.addColorStop(1, '#FFF9F5');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Borde decorativo doble
    ctx.strokeStyle = '#F79B72';
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    
    ctx.strokeStyle = '#3B8C88';
    ctx.lineWidth = 4;
    ctx.strokeRect(45, 45, canvas.width - 90, canvas.height - 90);
    
    // Título principal
    ctx.font = 'bold 48px Poppins';
    ctx.fillStyle = '#3B8C88';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 DIPLOMA OFICIAL 🏆', canvas.width / 2, 120);
    
    // Subtítulo
    ctx.font = '32px Poppins';
    ctx.fillStyle = '#F79B72';
    ctx.fillText('El Refugio de la Amistad', canvas.width / 2, 170);
    
    // Línea decorativa
    ctx.strokeStyle = '#F79B72';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 190);
    ctx.lineTo(600, 190);
    ctx.stroke();
    
    // Texto "Certifica que"
    ctx.font = '24px Poppins';
    ctx.fillStyle = '#6B7280';
    ctx.fillText('Este diploma certifica que', canvas.width / 2, 240);
    
    // Nombre del niño (DESTACADO)
    ctx.font = 'bold 56px Poppins';
    ctx.fillStyle = '#FF6347';
    ctx.fillText(nombreNino, canvas.width / 2, 310);
    
    // Subrayado del nombre
    const nombreWidth = ctx.measureText(nombreNino).width;
    ctx.strokeStyle = '#FF6347';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - nombreWidth / 2, 320);
    ctx.lineTo(canvas.width / 2 + nombreWidth / 2, 320);
    ctx.stroke();
    
    // Texto descriptivo
    ctx.font = '26px Poppins';
    ctx.fillStyle = '#1F2937';
    ctx.fillText('es ahora parte oficial del', canvas.width / 2, 370);
    ctx.fillText('Refugio de la Amistad', canvas.width / 2, 410);
    
    // Fecha
    const fecha = new Date().toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    ctx.font = 'italic 20px Poppins';
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText(`Emitido el ${fecha}`, canvas.width / 2, 480);
    
    // Firma
    ctx.font = 'italic 28px Poppins';
    ctx.fillStyle = '#3B8C88';
    ctx.fillText('Cuentos para Crecer', canvas.width / 2, 540);
    
    // Decoraciones - Estrellas
    ctx.font = '50px Arial';
    ctx.fillText('⭐', 120, 300);
    ctx.fillText('⭐', canvas.width - 120, 300);
    ctx.fillText('🎨', 100, 480);
    ctx.fillText('📚', canvas.width - 100, 480);
    
    console.log('✅ [REFUGIO] Diploma personalizado generado correctamente');
}

function descargarDiploma() {
    console.log('💾 [REFUGIO] Descargando diploma...');
    const canvas = document.getElementById('canvas-diploma');
    const nombreInput = document.getElementById('input-nombre');
    const nombreNino = nombreInput.value.trim() || 'Diploma';
    
    const link = document.createElement('a');
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `Diploma_${nombreNino.replace(/\s+/g, '_')}_${fecha}.png`;
    link.download = nombreArchivo;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    console.log('✅ [REFUGIO] Diploma descargado:', nombreArchivo);
}

function compartirDiploma() {
    console.log('📤 [REFUGIO] Compartiendo diploma...');
    const canvas = document.getElementById('canvas-diploma');
    
    canvas.toBlob(async (blob) => {
        const nombreInput = document.getElementById('input-nombre');
        const nombreNino = nombreInput.value.trim() || 'Diploma';
        const file = new File([blob], `Diploma_${nombreNino}.png`, { type: 'image/png' });
        
        if (navigator.share && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: `Diploma del Refugio - ${nombreNino}`,
                    text: '¡Mira mi diploma del Refugio de la Amistad! 🏆'
                });
                console.log('✅ [REFUGIO] Diploma compartido exitosamente');
            } catch (error) {
                console.log('❌ [REFUGIO] Compartir cancelado o error:', error);
                fallbackCompartir();
            }
        } else {
            console.log('⚠️ [REFUGIO] API Share no disponible, usando fallback');
            fallbackCompartir();
        }
    });
}

function fallbackCompartir() {
    const nombreInput = document.getElementById('input-nombre');
    const nombreNino = nombreInput.value.trim() || 'tu explorador';
    const texto = `¡${nombreNino} es ahora parte del Refugio de la Amistad! 🏆📚✨`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(texto).then(() => {
            alert('✅ Texto copiado al portapapeles. ¡Ahora puedes pegarlo donde quieras!');
        });
    } else {
        alert('💡 Descarga el diploma y compártelo en tus redes favoritas');
    }
}

function nuevoDiploma() {
    console.log('🔄 [REFUGIO] Creando nuevo diploma...');
    const nombreInput = document.getElementById('input-nombre');
    const diplomaContainer = document.getElementById('diploma-container');
    
    nombreInput.value = '';
    if (diplomaContainer) {
        diplomaContainer.style.display = 'none';
    }
    
    nombreInput.focus();
    nombreInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    console.log('✅ [REFUGIO] Listo para crear nuevo diploma');
}

function verLamina(numero) {
    console.log(`👁️ [REFUGIO] Mostrando lámina ${numero}...`);
    const url = `assets/img/laminas/lamina_0${numero}.png`;
    
    // Crear modal para vista previa
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
        padding: 20px;
    `;
    
    const img = document.createElement('img');
    img.src = url;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 12px;
        box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
    `;
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    // Cerrar al hacer clic
    modal.addEventListener('click', () => {
        modal.remove();
        console.log('✅ [REFUGIO] Vista previa cerrada');
    });
    
    // Cerrar con ESC
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

// ========================================
// 3. FUNCIONES AUXILIARES
// ========================================

/**
 * Cerrar sesión
 */
function cerrarSesion() {
    console.log('🚪 [REFUGIO] Solicitando cerrar sesión...');
    const confirmar = confirm('¿Seguro que quieres salir del Refugio? 👋');
    if (confirmar) {
        console.log('✅ [REFUGIO] Usuario confirmó salir');
        localStorage.removeItem('acceso_refugio_ok');
        localStorage.removeItem('usuario_email');
        localStorage.removeItem('fecha_acceso');
        console.log('🗑️ [REFUGIO] Datos de sesión eliminados');
        console.log('🚀 [REFUGIO] Redirigiendo a index.html...');
        window.location.href = 'index.html';
    } else {
        console.log('❌ [REFUGIO] Usuario canceló cerrar sesión');
    }
}

/**
 * Tracking de reproducción de audios (opcional)
 */
document.addEventListener('DOMContentLoaded', () => {
    const audioElements = document.querySelectorAll('audio');
    
    audioElements.forEach((audio, index) => {
        audio.addEventListener('play', () => {
            console.log(`▶️ Reproduciendo audio ${index + 1}`);
            // Aquí podrías enviar analytics a tu backend si lo necesitas
        });
        
        audio.addEventListener('ended', () => {
            console.log(`✅ Audio ${index + 1} completado`);
        });
    });
});

/**
 * Lazy loading de imágenes (optimización)
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
// ========================================
// 5. REPRODUCTOR DE AUDIO (Control de Audio Cards)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎵 [AUDIO] Inicializando reproductores de audio...');
    
    const audioPlayers = document.querySelectorAll('.audio-player');
    const playButtons = document.querySelectorAll('.audio-play-btn');
    
    console.log(`🎵 [AUDIO] ${audioPlayers.length} reproductores encontrados`);
    
    // Función para formatear tiempo (segundos a mm:ss)
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Función para pausar todos los audios
    function pauseAllAudios() {
        audioPlayers.forEach(audio => {
            if (!audio.paused) {
                audio.pause();
                const audioId = audio.getAttribute('data-audio-id');
                const btn = document.querySelector(`.audio-play-btn[data-audio-id="${audioId}"]`);
                if (btn) {
                    btn.classList.remove('playing');
                }
            }
        });
    }
    
    // Configurar cada botón de reproducción
    playButtons.forEach(button => {
        const audioId = button.getAttribute('data-audio-id');
        const audio = document.querySelector(`.audio-player[data-audio-id="${audioId}"]`);
        const progressBar = button.parentElement.querySelector('.audio-progress-bar');
        const progressContainer = button.parentElement.querySelector('.audio-progress');
        const currentTimeDisplay = button.parentElement.querySelector('.current-time');
        const totalTimeDisplay = button.parentElement.querySelector('.total-time');
        
        if (!audio) {
            console.warn(`⚠️ [AUDIO] No se encontró el audio con ID: ${audioId}`);
            return;
        }
        
        console.log(`✅ [AUDIO] Configurando reproductor ${audioId}`);
        
        // Actualizar duración total cuando el audio esté listo
        audio.addEventListener('loadedmetadata', () => {
            if (totalTimeDisplay) {
                totalTimeDisplay.textContent = formatTime(audio.duration);
                console.log(`⏱️ [AUDIO] Duración del audio ${audioId}: ${formatTime(audio.duration)}`);
            }
        });
        
        // Click en el botón play/pause
        button.addEventListener('click', () => {
            if (audio.paused) {
                console.log(`▶️ [AUDIO] Reproduciendo audio ${audioId}`);
                pauseAllAudios(); // Pausar todos los demás
                audio.play();
                button.classList.add('playing');
            } else {
                console.log(`⏸️ [AUDIO] Pausando audio ${audioId}`);
                audio.pause();
                button.classList.remove('playing');
            }
        });
        
        // Actualizar barra de progreso y tiempo actual
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const progress = (audio.currentTime / audio.duration) * 100;
                progressBar.style.width = progress + '%';
                
                if (currentTimeDisplay) {
                    currentTimeDisplay.textContent = formatTime(audio.currentTime);
                }
            }
        });
        
        // Reiniciar al terminar
        audio.addEventListener('ended', () => {
            console.log(`✅ [AUDIO] Audio ${audioId} finalizado`);
            button.classList.remove('playing');
            progressBar.style.width = '0%';
            if (currentTimeDisplay) {
                currentTimeDisplay.textContent = '0:00';
            }
        });
        
        // Click en la barra de progreso para buscar
        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => {
                const rect = progressContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = clickX / rect.width;
                const newTime = percentage * audio.duration;
                
                if (!isNaN(newTime)) {
                    audio.currentTime = newTime;
                    console.log(`⏩ [AUDIO] Saltando a ${formatTime(newTime)} en audio ${audioId}`);
                }
            });
        }
        
        // Manejo de errores
        audio.addEventListener('error', (e) => {
            console.error(`❌ [AUDIO] Error cargando audio ${audioId}:`, e);
            button.disabled = true;
            button.style.opacity = '0.5';
        });
    });
    
    // Configurar botones de descarga (funcionará correctamente en el servidor VPS)
    const downloadButtons = document.querySelectorAll('.audio-download-full-btn');
    
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const fileName = btn.getAttribute('href').split('/').pop();
            console.log(`📥 [DESCARGA] Descargando: ${fileName}`);
            // El atributo download del HTML manejará la descarga en el servidor
            // En local con file:// puede no funcionar, pero en el VPS con HTTP/HTTPS funcionará perfectamente
        });
    });
    
    console.log('✅ [AUDIO] Todos los reproductores configurados correctamente');
});