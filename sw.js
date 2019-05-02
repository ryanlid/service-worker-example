const cacheName = "v2";

const cacheAssets = [
  "index.html",
  "about.html",
  "/css/main.css",
  "/js/main.js"
];

// call install event
self.addEventListener("install", e => {
  console.log("Service Worker: Installed");
  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log("Service Worker: Caching Files");
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// call activate event
// 激活事件
self.addEventListener("activate", e => {
  console.log("Service Worker: activate");
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache != cacheName) {
            console.log("Service Worker:Clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// call fetch event
self.addEventListener("fetch", e => {
  console.log("Service Worker: Fetching");
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const resClone = res.clone();
        caches.open(cacheName).then(cache => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
