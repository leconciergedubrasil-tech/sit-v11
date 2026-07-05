// SIT v11 — Service Worker simplificado
// Versão sem cache para evitar problemas de redirect

const CACHE_NAME = 'sit-v11-v2';

// Instalar — sem precache para evitar erros
self.addEventListener('install', e => {
  self.skipWaiting();
});

// Ativar — limpar caches antigos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — passar tudo direto para a rede, sem interceptar
self.addEventListener('fetch', e => {
  // Não interceptar nada — deixar o browser lidar normalmente
  return;
});

