self.addEventListener("fetch", event => {
  event.respondWith(
    caches.open("fitness-rpg").then(cache =>
      cache.match(event.request).then(response =>
        response || fetch(event.request)
      )
    )
  );
});
