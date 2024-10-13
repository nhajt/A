const CACHE_NAME = 'my-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',  // Thêm trang dự phòng khi offline
  '/styles.css',
  '/script.js',
  '/video1.mp4',
  '/video2.mp4',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/Nhẫn Đính Hôn Sapphire.jpg',
  '/Nhẫn Bạc Ý Đính Đá CZ.jpg',
  '/Bông tai ngọc trai.jpg',
  '/Vòng Cổ Dancing Swan.jpg',
  '/lactayco4la.jpg',
  '/Lắc tay đá xanh.jpg',
  '/Dây truyền trái tim.jpg',
  '/Dây truyền hình bướm.jpg',
  '/daytruyenbac.jpg',
  '/trangsuc.jpg',
  '/daytruyentang.jpg',
  '/lactay.jpg'
];

// Caching resources during service worker installation
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetching resources and serving from cache, with a fallback to offline page
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // Serve from cache
      }
      return fetch(event.request).then(networkResponse => {
        // Only cache successful network responses
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // If both cache and network fail, show offline page
        return caches.match('/offline.html');
      });
    })
  );
});

// Cleaning up old caches during activation
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Delete old cache versions
          }
        })
      );
    })
  );
});
