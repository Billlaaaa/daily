const CACHE_NAME = 'mission-control-v1'
// Resolve against the SW's own scope so it works under any base path (e.g. /daily/)
const APP_SHELL = new URL('index.html', self.registration.scope).href

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(APP_SHELL)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(APP_SHELL))
    )
    return
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request)
      const network = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone())
          return response
        })
        .catch(() => cached)
      return cached || network
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const tab = event.notification.data?.tab
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus()
          if (tab) client.postMessage({ type: 'navigate', tab })
          return
        }
      }
      if (self.clients.openWindow) {
        const base = self.registration.scope
        return self.clients.openWindow(tab ? `${base}?tab=${tab}` : base)
      }
    })
  )
})
