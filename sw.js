/* Service worker — offline first */
var V = "empresa-demo-v1.0.0";
var ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/seed.js",
  "./js/store.js",
  "./js/ui.js",
  "./js/shared.js",
  "./js/views-core.js",
  "./js/views-sales.js",
  "./js/views-stock.js",
  "./js/views-expenses.js",
  "./js/views-people.js",
  "./js/views-system.js",
  "./js/app.js",
  "./fonts/inter-var.woff2",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(function (c) {
    return Promise.all(ASSETS.map(function (u) {
      return c.add(new Request(u, { cache: "reload" })).catch(function () {});
    }));
  }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== location.origin) return;

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(V).then(function (c) { c.put("./index.html", copy); });
        return res;
      }).catch(function () {
        return caches.match("./index.html").then(function (r) { return r || caches.match("./"); });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) {
        // atualiza em segundo plano
        fetch(req).then(function (res) {
          if (res && res.ok) caches.open(V).then(function (c) { c.put(req, res.clone()); });
        }).catch(function () {});
        return hit;
      }
      return fetch(req).then(function (res) {
        if (res && res.ok && res.type === "basic") {
          var copy = res.clone();
          caches.open(V).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        return new Response("", { status: 504, statusText: "Offline" });
      });
    })
  );
});
