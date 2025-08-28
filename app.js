// Variables globales
let deferredPrompt;
const presupuestoBtn = document.getElementById('presupuestoBtn');
const installBtn = document.getElementById('installBtn');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkInstallability();
});

// Inicialización de la aplicación
function initializeApp() {
    console.log('AppAgus PWA inicializada');
    
    // Verificar si la app está en modo standalone (instalada)
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('App ejecutándose en modo standalone');
        document.body.classList.add('standalone-mode');
    }
    
    // Verificar soporte para Service Worker
    if ('serviceWorker' in navigator) {
        console.log('Service Worker soportado');
    } else {
        console.log('Service Worker no soportado');
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Botón de presupuesto
    if (presupuestoBtn) {
        presupuestoBtn.addEventListener('click', openPresupuestoModal);
    }
    

    
    // Botón de instalación
    if (installBtn) {
        installBtn.addEventListener('click', installPWA);
    }
    
    // Event listener para beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('beforeinstallprompt disparado');
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });
    
    // Event listener para appinstalled
    window.addEventListener('appinstalled', (evt) => {
        console.log('PWA instalada exitosamente');
        hideInstallButton();
        deferredPrompt = null;
        
        // Mostrar notificación de éxito
        showNotification('¡AppAgus instalada exitosamente!', 'success');
    });
}

// Funcionalidad del módulo de presupuesto
function openPresupuestoModal() {
    // Redirigir al módulo completo de presupuesto
    window.location.href = './Presupuesto/';
    console.log('Redirigiendo al módulo de presupuesto');
}



// Funcionalidad de instalación PWA
function checkInstallability() {
    // Verificar si la app ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
        hideInstallButton();
        return;
    }
    
    // Verificar si se puede instalar
    if (deferredPrompt) {
        showInstallButton();
    }
    
    // Verificar criterios de instalación
    if (isInstallable()) {
        console.log('App cumple criterios de instalación');
    } else {
        console.log('App no cumple criterios de instalación');
    }
}

function isInstallable() {
    // Verificar que tengamos un Service Worker registrado
    if (!('serviceWorker' in navigator)) {
        console.log('Service Worker no soportado');
        return false;
    }
    
    // Verificar que tengamos un manifest válido
    if (!document.querySelector('link[rel="manifest"]')) {
        console.log('Manifest no encontrado');
        return false;
    }
    
    // Verificar que estemos en HTTPS o localhost
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        console.log('HTTPS requerido para instalación');
        return false;
    }
    
    return true;
}

function showInstallButton() {
    if (installBtn) {
        installBtn.style.display = 'flex';
        console.log('Botón de instalación mostrado');
    }
}

function hideInstallButton() {
    if (installBtn) {
        installBtn.style.display = 'none';
        console.log('Botón de instalación oculto');
    }
}

async function installPWA() {
    if (!deferredPrompt) {
        console.log('No hay prompt de instalación disponible');
        return;
    }
    
    try {
        console.log('Iniciando instalación de PWA...');
        
        // Mostrar el prompt de instalación
        deferredPrompt.prompt();
        
        // Esperar la respuesta del usuario
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('Usuario aceptó la instalación');
            showNotification('Instalando AppAgus...', 'info');
        } else {
            console.log('Usuario rechazó la instalación');
            showNotification('Instalación cancelada', 'warning');
        }
        
        // Limpiar el prompt
        deferredPrompt = null;
        hideInstallButton();
        
    } catch (error) {
        console.error('Error durante la instalación:', error);
        showNotification('Error durante la instalación', 'error');
    }
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Agregar estilos inline para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        max-width: 300px;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Configurar cierre automático
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            removeNotification(notification);
        });
    }
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

// Funcionalidad offline
function handleOffline() {
    console.log('App está offline');
    showNotification('AppAgus está funcionando offline', 'info');
}

function handleOnline() {
    console.log('App está online');
    showNotification('Conexión restaurada', 'success');
}

// Event listeners para estado de conexión
window.addEventListener('offline', handleOffline);
window.addEventListener('online', handleOnline);

// Funcionalidad de actualización
function checkForUpdates() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for (let registration of registrations) {
                registration.update();
            }
        });
    }
}

// Verificar actualizaciones cada 30 minutos
setInterval(checkForUpdates, 30 * 60 * 1000);



// Exportar funciones para uso global (opcional)
window.AppAgus = {
    openPresupuestoModal,
    installPWA,
    showNotification
};
