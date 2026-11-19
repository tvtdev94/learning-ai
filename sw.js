// Offline support for the "Sổ tay" app.
// Network first so new content shows up as soon as it is published;
// every page you open is also saved, so it still opens when offline.
const CACHE = 'so-tay-v4';
// The homepage keeps its styles and scripts in assets/home/, so they are saved with it.
const HOME = ['base.css', 'season.css', 'cursors.css', 'home.js', 'sky.js', 'season.js', 'profile.js', 'cursors.js', 'now.js'].map((f) => './assets/home/' + f);
const SHELL = ['./', './so-tay/', './manifest.webmanifest', './icons/icon-192.png', ...HOME];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req, { ignoreSearch: true }).then((hit) =>
          hit || (req.mode === 'navigate' ? caches.match('./') : Response.error())
        )
      )
  );
});
