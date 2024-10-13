const CACHE_NAME = 'my-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/video1.mp4',
  '/video2.mp4',
  '/icon-192x192.png',
  '/icon-512x512.png',
  // Thêm tất cả các tệp hình ảnh cần thiết vào đây
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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => caches.match('/'));
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
