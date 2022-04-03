function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
 
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);
 
  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const registerServiceWorker = async () => {
	if('serviceWorker' in navigator) {
		try {
			const registration = await navigator.serviceWorker.register('/notifications/sw.js', {scope: '/notifications/'});
      registration.update()
			if (registration.installing) {
				console.log('sw Installing');
			}
			else if(registration.waiting) {
				console.log('sw Waiting');
			}
      else if(registration.active) {
        console.log('sw Active');
      }
		} catch (e) {
      console.error(e);
    }
	}
}

registerServiceWorker()

function getDevices() {
  document.getElementById('devices').innerHTML = ''
  fetch('./getDevices').then(res => res.json()).then(data => {
    console.log(data.clients);
    data.clients.forEach(element => {
      let el = document.createElement('p')
      el.appendChild(document.createTextNode(element))
      document.getElementById('devices').append(el)
    });
  })
}

getDevices()

navigator.serviceWorker.ready
  .then(async (reg) => {
    return reg.pushManager.getSubscription()
      .then(async (sub) => {
        if(sub) {return sub};
        fetch('./vapidPublicKey').then(res => res.text()).then((key) => {
          return reg.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key)})
        })
      })
  }).then((sub) => {

    document.body.append(addBtn('Register device', () => {
      fetch('./register', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({subscription: sub, name: document.getElementById('name').value})}).then(res => console.log(res.status))
      console.log(sub, document.getElementById('name').value);
      getDevices()
    }))
  
    document.body.append(addBtn('Remove device', () => {
      fetch('./removeDevice/'+document.getElementById('name').value)
    }))

  document.body.append(addBtn('Send test notification.', () => {
    fetch('./sendNotification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({subscription: sub})
    })
  }))

  document.body.append(addBtn('Request Notifications', () => {
      Notification.requestPermission().then(res => {
        if(res === 'granted') {
          let n = new Notification("asdjkfajsdf")
        }
      })
    }))
  })

function addBtn(html,fun) {
  let btn = document.createElement('button');
  btn.innerHTML = html
  btn.addEventListener('click', fun)
  return btn
}
