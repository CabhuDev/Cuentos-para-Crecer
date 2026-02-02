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
    ctx.font = 'bold 50px Quicksand';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('🏡 Diploma del Refugio', canvas.width / 2, 100);
    
    // Subtítulo
    ctx.font = '30px Quicksand';
    ctx.fillStyle = '#666';
    ctx.fillText('Certificado de Amistad', canvas.width / 2, 160);
    
    // Texto inferior
    ctx.font = '20px Quicksand';
    ctx.fillStyle = '#999';
    ctx.fillText('es ahora parte del Refugio de la Amistad', canvas.width / 2, 380);
    
    // Firma
    ctx.font = 'italic 24px Quicksand';
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
    
    // Reinicializar el canvas
    inicializarDiploma();
    
    // Escribir el nombre del niño
    ctx.font = 'bold 60px Quicksand';
    ctx.fillStyle = '#FF6347';
    ctx.textAlign = 'center';
    ctx.fillText(nombreNino, canvas.width / 2, 280);
    
    // Descargar automáticamente
    setTimeout(() => {
        const link = document.createElement('a');
        const fecha = new Date().toLocaleDateString('es-ES');
        const nombreArchivo = `Diploma_${nombreNino.replace(/\s+/g, '_')}_${fecha}.png`;
        link.download = nombreArchivo;
        link.href = canvas.toDataURL('image/png');
        link.click();
        console.log('💾 [REFUGIO] Diploma descargado:', nombreArchivo);
        
        // Feedback visual
        alert(`✨ ¡Diploma creado para ${nombreNino}! Se ha descargado automáticamente.`);
    }, 100);
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
