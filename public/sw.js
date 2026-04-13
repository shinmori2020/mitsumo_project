// Service Worker - MitsuMO PWA
const CACHE_NAME = 'mitsumo-v12';
const BASE = self.location.pathname.replace(/sw\.js$/, '');

// インストール時：キャッシュにアプリシェルを保存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        BASE,
        BASE + 'index.html',
        BASE + 'favicon.svg',
        BASE + 'manifest.json',
      ]);
    })
  );
  self.skipWaiting();
});

// アクティベート時：古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// フェッチ時：ネットワーク優先、失敗したらキャッシュ
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).then((response) => {
      if (response.ok && event.request.method === 'GET') {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
      }
      return response;
    }).catch(() => {
      return caches.match(event.request).then((cached) => {
        if (cached) return cached;
        if (event.request.destination === 'document') {
          return caches.match(BASE + 'index.html');
        }
      });
    })
  );
});
