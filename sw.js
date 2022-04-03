self.addEventListener('push', (e) => {

  const pl = e.data ? JSON.parse(e.data.text()) : null;

  e.waitUntil(
    pl ?
      self.registration.showNotification(pl.title, {
        body: pl.content,
      })
    : 
    self.registration.showNotification("No title", {body: "No content"})
  );
});