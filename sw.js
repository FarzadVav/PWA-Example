const CACHE_NAME = "cache-v9"
const DYNAMIC_CACHE_NAME = "dynamic-cache-v5"
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
