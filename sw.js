const CACHE_NAME = "cache-v10"
const DYNAMIC_CACHE_NAME = "dynamic-cache-v6"
const ASSETS = [
  "/",
  "index.html",
  "fallback.html",
  "style.css",
  "main.js",
  "install.js",
  "counter.js",
  "posts.js",
  "icon-48x48.png",
  "web.gif",
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
  const cachesToDelete = keyList.filter((key) => key !== CACHE_NAME && key !== DYNAMIC_CACHE_NAME)
  await Promise.all(cachesToDelete.map((key) => caches.delete(key)))
}
self.addEventListener("activate", (ev) => {
  ev.waitUntil(deleteOldCaches())
})

const limitCacheSize = async (name) => {
  const openedCache = await caches.open(name)
  const cacheKeys = await openedCache.keys()
  if (cacheKeys.length > 2) {
    openedCache.delete(cacheKeys[0]).then(() => limitCacheSize(name))
  }
}
self.addEventListener("fetch", (ev) => {
  ev.respondWith(
    caches
      .match(ev.request)
      .then((cacheRes) => {
        return (
          cacheRes ||
          fetch(ev.request).then((fetchRes) => {
            return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
              cache.put(ev.request.url, fetchRes)
              limitCacheSize(DYNAMIC_CACHE_NAME)
              return fetchRes
            })
          })
        )
      })
      .catch(() => {
        if (ev.request.url.includes(".html")) {
          return caches.match("fallback.html")
        }
      })
  )
})
