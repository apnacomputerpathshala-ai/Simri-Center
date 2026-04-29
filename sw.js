// --- VERSION CONTROL ---
// जब भी आप ऐप में बदलाव करें, बस यहाँ वर्जन बदल दें (जैसे v2.3.1 से v2.3.2)
const CACHE_NAME = 'kyp-simri-v2.3.1';

// उन फाइलों की लिस्ट जिन्हें ऑफलाइन एक्सेस के लिए सेव करना है
const assets = [
  './',
  './index.html', // आपकी फाइल का नाम यहाँ index7.html है
  './manifest.json',
  './logo.png', 
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// 1. Install Event: फाइलों को कैश में डालना
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PWA: Caching assets');
      return cache.addAll(assets);
    })
  );
  // नया वर्जन मिलते ही तुरंत पुराने को "Skip" करना
  self.skipWaiting(); 
});

// 2. Activate Event: पुराने और बेकार कैश को डिलीट करना
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => {
          console.log('PWA: Clearing old cache', key);
          return caches.delete(key);
        })
      );
    })
  );
  // तुरंत क्लाइंट्स पर कंट्रोल लेना
  return self.clients.claim();
});

// 3. Fetch Event: ऑफलाइन होने पर कैश से डेटा दिखाना
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // अगर कैश में है तो वहां से दें, वरना नेटवर्क से लें
      return response || fetch(event.request);
    })
  );
});
