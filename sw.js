const CACHE_NAME = "pwa-counter.v2"
const ASSETS = [
  "/",
  "/index.html",
  "/src/style.css",
  "/src/main.js",
  "/src/scripts/install.js",
  "/src/scripts/counter.js",
  "/src/scripts/posts.js",
  "/public/icon-48x48.png",
  "/public/web.gif",
]

// installing
const cacheAssets = async (resources) => {
  const cache = await caches.open(CACHE_NAME)
  await cache.addAll(resources)
}
self.addEventListener("install", (ev) => {
  ev.waitUntil(cacheAssets(ASSETS))
})

// activating
const deleteOldCaches = async () => {
  const keyList = await caches.keys()
  const cachesToDelete = keyList.filter((key) => key !== CACHE_NAME)
  await Promise.all(cachesToDelete.map((key) => caches.delete(key)))
}
self.addEventListener("activate", (ev) => {
  ev.waitUntil(deleteOldCaches())
})

// fetching
const cacheFirst = async (request) => {
  const cacheResponse = await caches.match(request)

  if (cacheResponse) {
    return cacheResponse
  }

  return fetch(request)
}
self.addEventListener("fetch", (ev) => {
  ev.respondWith(cacheFirst(ev.request))
})
