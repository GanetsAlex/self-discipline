// Сервис-воркер для PWA — стратегия "сначала сеть"
const CACHE_NAME = 'self-discipline-v2';

// Отвечаем на запросы: сначала пробуем сеть, при ошибке — кеш
self.addEventListener('fetch', event => {
  // Для HTML-страниц — сначала сеть
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Обновляем кеш новой версией
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Для остальных файлов (css, js, иконки) — сначала кеш, потом сеть
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// При активации удаляем старые кеши
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});
