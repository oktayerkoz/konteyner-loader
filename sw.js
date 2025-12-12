const CACHE_NAME = "konteyner3d-v1";

const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./data.json",
  "https://unpkg.com/three@0.146.0/build/three.min.js",
  "https://unpkg.com/three@0.146.0/examples/js/controls/OrbitControls.js"
];

// Kurulumda cache'le
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Eski cache'leri temizle
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// Ağ isteği → önce cache, olmazsa network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          // offline'dayken ve cache yoksa: boş dön
          return new Response("Offline – içerik bulunamadı.", {
            status: 503,
            statusText: "Service Unavailable"
          });
        })
      );
    })
  );
});
