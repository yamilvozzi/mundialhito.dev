// Mundialhito — Service Worker (network-first, sin cache agresivo)
// Propósito: habilitar instalación como PWA. No cachea nada para evitar
// que los usuarios vean versiones desactualizadas después de un deploy.

const SW_VERSION = 'v1';

self.addEventListener('install', function(event) {
  // Activar inmediatamente sin esperar a que se cierren otras pestañas
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  // Tomar control de todas las pestañas abiertas de inmediato
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', function(event) {
  // Estrategia: network-first puro.
  // Siempre intenta ir a la red. Si falla (offline), deja que el browser
  // maneje el error normalmente. No se guarda nada en cache.
  event.respondWith(
    fetch(event.request).catch(function() {
      // Sin respuesta de red y sin cache: el browser muestra su error offline.
      // Para una app que requiere autenticación y base de datos en tiempo real,
      // esto es lo correcto — no tiene sentido mostrar datos cacheados viejos.
      return new Response(
        '<html><body style="font-family:sans-serif;background:#272727;color:#F0EDE6;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><p style="text-align:center;opacity:0.6;">Sin conexión.<br>Volvé a intentarlo cuando tengas internet.</p></body></html>',
        { headers: { 'Content-Type': 'text/html' } }
      );
    })
  );
});
