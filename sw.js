// SIT v11 — Service Worker · PWA Offline Support
const CACHE    = 'sit-v11-cache-v1';
const PRECACHE = [
  '/', '/index.html', '/mon.html', '/team.html', '/athlete.html',
  '/copa.html', '/eqs.html', '/alert.html', '/fave.html', '/help.html',
  '/sit-core.js', '/sit-db.js', '/sit-indicators.js', '/sit-auth.js',
  '/sit-shell.css', '/sit-panels.js', '/sit-supabase.js',
  '/sit-news.js', '/sit-vault-bridge.js',
];

// Instalar: pré-cachear arquivos core
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(PRECACHE.map(url => new Request(url, { cache: 'no-store' })))
        .catch(err => console.warn('[SW] Precache parcial:', err));
    })
  );
  self.skipWaiting();
});

// Ativar: limpar caches antigos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first para assets, network-first para dados
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // APIs externas — sempre network (sem cache)
  if (url.hostname !== location.hostname) {
    e.respondWith(
      fetch(e.request).catch(() =>
        new Response('{"error":"offline"}', { headers: { 'Content-Type': 'application/json' } })
      )
    );
    return;
  }

  // Assets HTML/CSS/JS — cache-first com fallback network
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => {
        // Offline fallback: retornar mon.html para navegação
        if (e.request.mode === 'navigate') return caches.match('/mon.html');
      });
    })
  );
});

// Push notifications para alertas SIT
self.addEventListener('push', e => {
  const data = e.data?.json() || {};
  self.registration.showNotification(data.title || 'SIT Alert', {
    body:  data.body  || 'Alerta ativo no terminal',
    icon:  '/icon-192.png',
    badge: '/icon-192.png',
    tag:   data.tag   || 'sit-alert',
    data:  { url: data.url || '/alert.html' },
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.openWindow(e.notification.data?.url || '/mon.html')
  );
});
