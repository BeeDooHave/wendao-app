// 问道 PWA Service Worker
// 仅缓存静态资源，让 App 完全离线可用
const CACHE = "wendao-v0.58-first-qi-rainmark";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=0.58-first-qi-rainmark",
  "./vendor/lunar.js?v=1.7.7",
  "./app.js?v=0.58-first-qi-rainmark",
  "./manifest.json",
  "./assets/home-cultivation-base-v2.webp",
  "./assets/home-fashang-qi.webp?v=2",
  "./assets/home-fashang-foundation.webp?v=1",
  "./assets/generated/foundation-purple-flame-v1.webp",
  "./assets/audio/completion-bell.ogg",
  "./assets/audio/rain.ogg",
  "./assets/audio/guqin.ogg",
  "./assets/audio/muyu.ogg",
  "./assets/home-study-scene-v1.webp",
  "./assets/home-body-tempering-v1.webp",
  "./assets/onboarding-mountain-gate-v1.webp",
  "./assets/mentors/guides-lineup-v1.webp",
  "./assets/mentors/wenzhong-entrance-v1.webp",
  "./assets/mentors/wenzhaoshuang-entrance-v1.webp",
  "./assets/mentors/shibuyan-lantern-entrance-v2.webp",
  "./assets/mentors/suqinghe-entrance-v1.webp",
  "./assets/mentors/shenqingjian-entrance-v1.webp",
  "./assets/mentors/luoheng-entrance-v1.webp",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", clone));
        }
        return res;
      }).catch(() => caches.match("./index.html").then((hit) => hit || caches.match("./")))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((hit) => {
      return hit || fetch(e.request).then((res) => {
        // 缓存新加载的同源资源
        if (res && res.status === 200 && e.request.url.startsWith(self.location.origin)) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      }).catch(() => hit);
    })
  );
});
