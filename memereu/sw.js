self.addEventListener('push', (e) => {
	const pl = e.data ? JSON.parse(e.data.text()) : null;
 
	e.waitUntil(
	  pl ?
		 self.registration.showNotification(pl.title, {
			body: pl.content,
			icon: 'https://secure.gravatar.com/avatar/79c90da2f58a4ca921bbafd879659822?s=96&d=mm&r=g',
			image: 'https://memer.eu/assets/screencap.png'
		 })
	  : 
	  self.registration.showNotification("No title", {body: "No content"})
	);
 });