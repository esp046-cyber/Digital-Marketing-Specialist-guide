/* ==========================================================================
   Digital Marketing Specialist Guide PWA — Service Worker (v2.4.0)
   - Pre-caches core shell assets (index.html, style.css, script.js, offline.html, icons)
   - Stale-While-Revalidate for JSON/API catalog assets
   - Background Sync ('sync-marketing-actions') to flush IndexedDB offline queue
   ========================================================================== */

const CACHE_NAME = 'dms-workstation-v4.0.0';
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './offline.html',
  './favicon.ico',
  './icon-192.png',
  './icon-512.png',
  './assets/og-image.png',
  './assets/icons.svg',
  './api/tasks-catalog.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(CORE_ASSETS.map((url) => cache.add(url)));
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Navigation requests fall back to cached index.html or offline.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() =>
          caches.match('./index.html').then((res) => res || caches.match('./offline.html'))
        )
    );
    return;
  }

  // Stale-while-revalidate for static assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});

// Background Sync Flush Handler for Offline IndexedDB Queue
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-marketing-actions') {
    event.waitUntil(flushIndexedDBQueueInWorker());
  }
});

function flushIndexedDBQueueInWorker() {
  return new Promise((resolve) => {
    const req = indexedDB.open('dms_offline_db', 1);
    req.onerror = () => resolve();
    req.onsuccess = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('sync_queue')) {
        resolve();
        return;
      }
      const tx = db.transaction('sync_queue', 'readwrite');
      const store = tx.objectStore('sync_queue');
      const getAll = store.getAll();
      getAll.onsuccess = () => {
        const items = getAll.result || [];
        items.forEach((item) => {
          if (item.status !== 'synced') {
            item.status = 'synced';
            item.syncedAt = new Date().toISOString();
            store.put(item);
          }
        });
      };
      tx.oncomplete = () => {
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) =>
            client.postMessage({ type: 'BACKGROUND_SYNC_FLUSHED', timestamp: new Date().toISOString() })
          );
        });
        resolve();
      };
    };
  });
}
