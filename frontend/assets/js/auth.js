/**
 * AUTH.JS - Lógica de Autenticación
 * Maneja el formulario de acceso y comunicación con la API
 */

console.log('🚀 [AUTH] Script cargado correctamente');

// Configuración de la API
const API_BASE_URL = window.location.origin + '/api';
const API_ENDPOINT = `${API_BASE_URL}/register`;

console.log('🔧 [AUTH] API configurada:', {
    base: API_BASE_URL,
    endpoint: API_ENDPOINT
});

// Referencias a elementos del DOM
const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submit-btn');
const loadingMsg = document.getElementById('loading-msg');
const errorMsg = document.getElementById('error-msg');

console.log('🎯 [AUTH] Elementos del DOM:', {
    form: form ? '✅ Encontrado' : '❌ No encontrado',
    emailInput: emailInput ? '✅ Encontrado' : '❌ No encontrado',
    submitBtn: submitBtn ? '✅ Encontrado' : '❌ No encontrado',
    loadingMsg: loadingMsg ? '✅ Encontrado' : '❌ No encontrado',
    errorMsg: errorMsg ? '✅ Encontrado' : '❌ No encontrado'
});

// Event Listener del formulario
if (form) {
    console.log('✅ [AUTH] Event listener del formulario añadido');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('📝 [AUTH] Formulario enviado');
        
        const email = emailInput.value.trim();
        console.log('📧 [AUTH] Email introducido:', email);
    
        // Validación básica
        if (!email || !isValidEmail(email)) {
            console.warn('⚠️ [AUTH] Email inválido:', email);
            showError('Por favor, introduce un correo electrónico válido');
            return;
        }
        console.log('✅ [AUTH] Email válido');
    
        // UX: Feedback visual
        submitBtn.disabled = true;
        loadingMsg.style.display = 'block';
        errorMsg.style.display = 'none';
        console.log('⏳ [AUTH] Mostrando estado de carga...');
        
        try {
            // Petición al Backend
            console.log('🌐 [AUTH] Enviando petición a:', API_ENDPOINT);
            const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });
        
        const data = await response.json();
            console.log('📦 [AUTH] Respuesta del servidor:', {
                status: response.status,
                ok: response.ok,
                data: data
            });
            
            if (response.ok && data.success) {
                console.log('🎉 [AUTH] Registro exitoso');
                // Guardamos el "token" de acceso en localStorage
                localStorage.setItem('acceso_refugio_ok', 'true');
                localStorage.setItem('usuario_email', email);
                localStorage.setItem('fecha_acceso', new Date().toISOString());
                console.log('💾 [AUTH] Datos guardados en localStorage');
                
                // Redirección exitosa
                console.log('🚀 [AUTH] Redirigiendo a refugio.html...');
                window.location.href = 'refugio.html';
            } else {
                console.error('❌ [AUTH] Respuesta no exitosa del servidor');
                throw new Error(data.message || 'Error al registrar el email');
            }
            
        } catch (error) {
            console.error('💥 [AUTH] Error capturado:', {
                message: error.message,
                stack: error.stack,
                tipo: error.name
            });
        
            // En caso de error de red, dejamos pasar al usuario
            // para no frustrar la experiencia (modo offline-first)
            if (error.message.includes('fetch') || error.message.includes('network')) {
                console.warn('🔌 [AUTH] Error de red detectado. Permitiendo acceso offline...');
                localStorage.setItem('acceso_refugio_ok', 'true');
                localStorage.setItem('usuario_email', email);
                console.log('🚀 [AUTH] Redirigiendo en modo offline...');
                window.location.href = 'refugio.html';
            } else {
                console.error('❌ [AUTH] Mostrando error al usuario:', error.message);
                showError(error.message || 'Hubo un problema al procesar tu solicitud. Inténtalo de nuevo.');
                submitBtn.disabled = false;
                loadingMsg.style.display = 'none';
            }
        }
    });
} else {
    console.error('❌ [AUTH] ERROR CRÍTICO: Formulario no encontrado en el DOM');
}

/**
 * Validador de email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Mostrar mensaje de error
 */
function showError(message) {
    errorMsg.textContent = '❌ ' + message;
    errorMsg.style.display = 'block';
}

/**
 * Auto-focus en el campo de email
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 [AUTH] DOM cargado completamente');
    
    if (emailInput) {
        emailInput.focus();
        console.log('🎯 [AUTH] Focus en campo de email');
    }
    
    // Si ya tiene acceso, redirigir directamente
    const accesoActual = localStorage.getItem('acceso_refugio_ok');
    console.log('🔍 [AUTH] Estado de acceso actual:', accesoActual);
    
    if (accesoActual === 'true') {
        console.log('✅ [AUTH] Usuario ya tiene acceso');
        const confirmacion = confirm('Ya tienes acceso al refugio. ¿Quieres entrar directamente?');
        if (confirmacion) {
            window.location.href = 'refugio.html';
        }
    }
});
