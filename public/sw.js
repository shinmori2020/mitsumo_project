// Service Worker - MitsuMO PWA
const CACHE_NAME = 'mitsumo-v1';

// インストール時：キャッシュにアプリシェルを保存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/mitsumo_project/',
        '/mitsumo_project/index.html',
        '/mitsumo_project/favicon.svg',
        '/mitsumo_project/manifest.json',
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

// フェッチ時：キャッシュ優先、なければネットワーク
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // 正常なレスポンスをキャッシュに追加
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(() => {
        // オフラインでキャッシュにもない場合
        if (event.request.destination === 'document') {
          return caches.match('/mitsumo_project/index.html');
        }
      });
    })
  );
});
