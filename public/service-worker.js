// Kill-switch service worker to decommission legacy Vue CLI service-worker.js
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      )
    }).then(() => {
      return self.registration.unregister()
    }).then(() => {
      return self.clients.matchAll({ type: 'window' })
    }).then((clients) => {
      for (const client of clients) {
        if ('navigate' in client) {
          client.navigate(client.url)
        }
      }
    })
  )
})
