const SHELL='mm-shell-v1',PACKS='mm-packs-v1';
const FILES=['./','index.html','meta.js','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==SHELL&&k!==PACKS).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  if(r.url.includes('/packs/')){
    e.respondWith(caches.open(PACKS).then(async c=>{const m=await c.match(r.url);if(m)return m;const n=await fetch(r.url);if(n.ok)c.put(r.url,n.clone());return n}));
    return;
  }
  e.respondWith(caches.open(SHELL).then(async c=>{
    const m=await c.match(r,{ignoreSearch:true});
    const f=fetch(r).then(n=>{if(n.ok)c.put(r,n.clone());return n}).catch(()=>m);
    return m||f;
  }));
});
