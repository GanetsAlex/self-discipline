// Простой сервис-воркер для PWA

const CACHE_NAME = 'self-discipline-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Устанавливаем сервис-воркер и кешируем файлы
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кеш открыт');
        return cache.addAll(urlsToCache);
      })
  );
});

// Отвечаем на запросы: сначала из кеша, потом с сервера
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Если файл есть в кеше — возвращаем его
        if (response) {
          return response;
        }
        // Иначе загружаем с сервера
        return fetch(event.request);
      })
  );
});

// Обновляем кеш при активации (удаляем старые версии)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаляем старый кеш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});