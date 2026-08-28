/* Offline shell. Bump CACHE when you change any of the files below. */
const CACHE = "duit-v15";
const SHELL = ["./", "./index.html", "./app.css", "./app.js", "./manifest.webmanifest", "./icon.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  // Never cache Firebase or font traffic — let the network (or its own SDK cache) handle it.
  if (url.hostname.endsWith("googleapis.com") || url.hostname.endsWith("gstatic.com") || url.hostname.endsWith("firebaseio.com")) return;

  e.respondWith(
    caches.match(e.request).then(hit => {
      const live = fetch(e.request)
        .then(res => {
          if (res && res.ok && url.origin === location.origin) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => hit || caches.match("./index.html"));
      return hit || live;
    })
  );
});
