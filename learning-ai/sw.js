// The site moved from /learning-ai/ to the root of tvtdev94.github.io.
// Browsers that installed the old app still check this file for updates;
// this version removes the old service worker and reloads open pages,
// which then follow the redirect pages in this folder to the new address.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.registration.unregister()
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => clients.forEach((c) => c.navigate(c.url)))
  );
});
