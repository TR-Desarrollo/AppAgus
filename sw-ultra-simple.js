// Service Worker ULTRA SIMPLE para AppAgus PWA
// Solo sirve archivos - Sin lógica compleja que pueda fallar

const CACHE_NAME = 'appagus-ultra-simple-v1';

// Archivos mínimos necesarios
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/LogoCaballo.jpg'
];

// Instalación súper simple
self.addEventListener('install', (event) => {
    console.log('Service Worker ULTRA SIMPLE instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache abierto, agregando archivos...');
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(() => {
                console.log('Instalación completada - Archivos cacheados');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Error en instalación:', error);
            })
    );
});

// Activación simple
self.addEventListener('activate', (event) => {
    console.log('Service Worker ULTRA SIMPLE activando...');
    
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
                console.log('Service Worker activado');
                return self.clients.claim();
            })
    );
});

// Fetch súper simple - Solo cache first
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // Solo manejar GET requests
    if (request.method !== 'GET') return;
    
    // Estrategia ULTRA SIMPLE: Cache First siempre
    event.respondWith(
        caches.match(request)
            .then((response) => {
                // Si está en cache, devolverlo
                if (response) {
                    console.log('Archivo servido desde cache:', request.url);
                    return response;
                }
                
                // Si no está en cache, hacer fetch
                return fetch(request)
                    .then((networkResponse) => {
                        // Cachear la respuesta para la próxima vez
                        if (networkResponse.ok) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(request, responseClone);
                                    console.log('Archivo cacheado:', request.url);
                                });
                        }
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('Error en fetch:', error);
                        
                        // Si es una navegación, intentar servir index.html
                        if (request.mode === 'navigate') {
                            console.log('Navegación falló, sirviendo index.html');
                            return caches.match('/index.html');
                        }
                        
                        // Para otros archivos, devolver error
                        return new Response('Error: No se pudo cargar el archivo', {
                            status: 404,
                            statusText: 'Not Found'
                        });
                    });
            })
    );
});

console.log('Service Worker ULTRA SIMPLE cargado - Sin lógica compleja');
