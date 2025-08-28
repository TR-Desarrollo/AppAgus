// Service Worker para AppAgus PWA
const CACHE_NAME = 'appagus-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Archivos estáticos para cache
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/LogoCaballo.jpg',
    '/icons/icon.svg'
];

// Estrategia de cache: Cache First para archivos estáticos
const STATIC_CACHE_STRATEGY = 'cache-first';
// Estrategia de cache: Network First para archivos dinámicos
const DYNAMIC_CACHE_STRATEGY = 'network-first';

// Evento de instalación
self.addEventListener('install', (event) => {
    console.log('Service Worker instalando...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Cache estático abierto');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Archivos estáticos cacheados');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Error al cachear archivos estáticos:', error);
            })
    );
});

// Evento de activación
self.addEventListener('activate', (event) => {
    console.log('Service Worker activando...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Limpiar caches antiguos
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Eliminando cache antiguo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activado y caches limpiados');
                return self.clients.claim();
            })
    );
});

// Evento de fetch - Interceptar peticiones
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Solo manejar peticiones HTTP/HTTPS
    if (request.method !== 'GET') {
        return;
    }
    
    // Manejar navegación a la página principal
    if (request.mode === 'navigate') {
        event.respondWith(handleNavigation(request));
        return;
    }
    
    // Estrategia para archivos estáticos
    if (isStaticFile(request.url)) {
        event.respondWith(handleStaticFile(request));
        return;
    }
    
    // Estrategia para archivos dinámicos
    if (isDynamicFile(request.url)) {
        event.respondWith(handleDynamicFile(request));
        return;
    }
    
    // Estrategia por defecto: Network First
    event.respondWith(handleNetworkFirst(request));
});

// Verificar si es un archivo estático
function isStaticFile(url) {
    return STATIC_FILES.some(staticFile => url.includes(staticFile)) ||
           url.includes('.css') ||
           url.includes('.js') ||
           url.includes('.png') ||
           url.includes('.jpg') ||
           url.includes('.svg') ||
           url.includes('.ico');
}

// Verificar si es un archivo dinámico
function isDynamicFile(url) {
    return url.includes('/api/') ||
           url.includes('data') ||
           url.includes('json');
}

// Estrategia Cache First para archivos estáticos
async function handleStaticFile(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('Archivo estático servido desde cache:', request.url);
            return cachedResponse;
        }
        
        // Si no está en cache, hacer fetch y cachear
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('Archivo estático cacheado:', request.url);
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Error en estrategia estática:', error);
        // Fallback: intentar servir desde cache aunque sea antiguo
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Estrategia Network First para archivos dinámicos
async function handleDynamicFile(request) {
    try {
        // Intentar fetch primero
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Cachear la respuesta
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('Archivo dinámico cacheado:', request.url);
        }
        return networkResponse;
    } catch (error) {
        console.log('Red no disponible, intentando cache:', request.url);
        
        // Fallback al cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Si no hay cache, mostrar página offline
        return getOfflineResponse();
    }
}

// Estrategia para navegación
async function handleNavigation(request) {
    try {
        // Intentar fetch primero
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Cachear la respuesta
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('Navegación cacheada:', request.url);
        }
        return networkResponse;
    } catch (error) {
        console.log('Red no disponible, intentando cache para navegación:', request.url);
        
        // Fallback al cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('Navegación servida desde cache:', request.url);
            return cachedResponse;
        }
        
        // Si no hay cache, intentar servir index.html
        const fallbackResponse = await caches.match('/index.html');
        if (fallbackResponse) {
            console.log('Sirviendo index.html como fallback para navegación');
            return fallbackResponse;
        }
        
        // Si no hay nada, mostrar página offline
        return getOfflineResponse();
    }
}

// Estrategia Network First por defecto
async function handleNetworkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Cachear la respuesta
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Red no disponible, intentando cache:', request.url);
        
        // Fallback al cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Si no hay cache, mostrar página offline
        return getOfflineResponse();
    }
}

// Generar respuesta offline
async function getOfflineResponse() {
    const offlineHTML = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AppAgus - Sin Conexión</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #2563eb, #1d4ed8);
                    color: white;
                    margin: 0;
                    padding: 2rem;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }
                .offline-container {
                    max-width: 400px;
                }
                .offline-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
                h1 {
                    margin-bottom: 1rem;
                    font-size: 1.5rem;
                }
                p {
                    margin-bottom: 1.5rem;
            opacity: 0.9;
            line-height: 1.6;
        }
        .retry-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.2s;
        }
        .retry-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
        }
    </style>
</head>
<body>
    <div class="offline-container">
        <div class="offline-icon">📱</div>
        <h1>Sin Conexión</h1>
        <p>AppAgus está funcionando en modo offline. Algunas funcionalidades pueden no estar disponibles.</p>
        <button class="retry-btn" onclick="window.location.reload()">Reintentar</button>
    </div>
</body>
</html>`;

    return new Response(offlineHTML, {
        headers: { 'Content-Type': 'text/html' }
    });
}

// Evento de mensaje para comunicación con la app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});

// Evento de push (para notificaciones push futuras)
self.addEventListener('push', (event) => {
    console.log('Push event recibido:', event);
    
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body || 'Nueva notificación de AppAgus',
            icon: '/LogoCaballo.jpg',
            badge: '/LogoCaballo.jpg',
            vibrate: [200, 100, 200],
            data: {
                url: data.url || '/'
            },
            actions: [
                {
                    action: 'open',
                    title: 'Abrir',
                    icon: '/LogoCaballo.jpg'
                },
                {
                    action: 'close',
                    title: 'Cerrar',
                    icon: '/LogoCaballo.jpg'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'AppAgus', options)
        );
    }
});

// Evento de clic en notificación
self.addEventListener('notificationclick', (event) => {
    console.log('Notificación clickeada:', event);
    
    event.notification.close();
    
    if (event.action === 'open' || event.action === undefined) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});

// Evento de sincronización en segundo plano
self.addEventListener('sync', (event) => {
    console.log('Sync event:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

// Función de sincronización en segundo plano
async function doBackgroundSync() {
    try {
        console.log('Ejecutando sincronización en segundo plano...');
        
        // Aquí se pueden agregar tareas de sincronización
        // como enviar datos offline, actualizar cache, etc.
        
        console.log('Sincronización completada');
    } catch (error) {
        console.error('Error en sincronización:', error);
    }
}

// Función para limpiar caches antiguos
async function cleanupOldCaches() {
    try {
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
            name !== STATIC_CACHE && name !== DYNAMIC_CACHE
        );
        
        await Promise.all(
            oldCaches.map(name => caches.delete(name))
        );
        
        console.log('Caches antiguos limpiados');
    } catch (error) {
        console.error('Error limpiando caches:', error);
    }
}

// Limpiar caches cada 24 horas
setInterval(cleanupOldCaches, 24 * 60 * 60 * 1000);

console.log('Service Worker cargado:', CACHE_NAME);
