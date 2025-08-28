// Service Worker SIMPLIFICADO para AppAgus PWA - Instalación RÁPIDA
const CACHE_NAME = 'appagus-simple-v1';

// Solo archivos ESENCIALES para la instalación
const ESSENTIAL_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/LogoCaballo.jpg'
];

// Evento de instalación - SIMPLIFICADO
self.addEventListener('install', (event) => {
    console.log('Service Worker SIMPLIFICADO instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache abierto, cacheando archivos esenciales...');
                // Solo cachear archivos esenciales
                return cache.addAll(ESSENTIAL_FILES);
            })
            .then(() => {
                console.log('Instalación COMPLETADA - Archivos esenciales cacheados');
                // Activar inmediatamente
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Error en instalación:', error);
            })
    );
});

// Evento de activación - SIMPLIFICADO
self.addEventListener('activate', (event) => {
    console.log('Service Worker SIMPLIFICADO activando...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Eliminando cache antiguo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker SIMPLIFICADO activado');
                return self.clients.claim();
            })
    );
});

// Estrategia de fetch SIMPLIFICADA
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // Solo manejar GET requests
    if (request.method !== 'GET') return;
    
    // Estrategia SIMPLE: Cache First para archivos esenciales
    if (ESSENTIAL_FILES.some(file => request.url.includes(file))) {
        event.respondWith(
            caches.match(request)
                .then((response) => {
                    // Si está en cache, devolverlo
                    if (response) {
                        return response;
                    }
                    
                    // Si no está en cache, hacer fetch y cachear
                    return fetch(request)
                        .then((networkResponse) => {
                            if (networkResponse.ok) {
                                const responseClone = networkResponse.clone();
                                caches.open(CACHE_NAME)
                                    .then((cache) => {
                                        cache.put(request, responseClone);
                                    });
                            }
                            return networkResponse;
                        });
                })
        );
        return;
    }
    
    // Para otros archivos: Network First simple
    event.respondWith(
        fetch(request)
            .catch(() => {
                return caches.match(request);
            })
    );
});

// Evento de mensaje SIMPLIFICADO
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('Service Worker SIMPLIFICADO cargado - Instalación RÁPIDA');
