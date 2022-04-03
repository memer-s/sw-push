const express = require('express')
const webPush = require('web-push')
const router = express.Router()

webPush.setVapidDetails('https://serviceworke.rs/', 'BFx-b9g8CBQ2gsNnWZIlA0tSulzF8ufLpy0qpSAQ7Hjq2MQvyKVgfzpT2HrOW9I5FjKEm3B-PAKmlEXgyhFIZjg', 'NiLVNp4DiFbs_Iu3fUj-ZmKbwcbWJAGJ3AN0eVMwwsA')

router.get('/vapidPublicKey', (req, res) => {
	res.send('BFx-b9g8CBQ2gsNnWZIlA0tSulzF8ufLpy0qpSAQ7Hjq2MQvyKVgfzpT2HrOW9I5FjKEm3B-PAKmlEXgyhFIZjg')
})

router.get('/getDevices', (req, res) => {
	res.json({clients: Object.keys(clients)})
})

router.get('/removeDevice/:devId', (req, res) => {
	delete clients[req.params['devId']];
	res.sendStatus(200)
})

let clients = {}

router.post('/register', (req, res) => {
	clients[req.body.name] = req.body.subscription
	console.log(clients);
	res.sendStatus(201);
})

router.post('/sendNotification', (req, res) => {
	
	const subscription = req.body.subscription;
	console.log(subscription);
	const payload = JSON.stringify({title: 'TEST TITLE', content: 'TEST CONTENT'});
	const options = {
		TTL: req.body.ttl
	};
	setTimeout(() => {
		webPush.sendNotification(subscription, payload, options)
			.then(res.sendStatus(201))
			.catch(err => console.error(err))
	}, 500)
	
})

router.post('/sendNotifications', (req, res) => {
	console.log("number of clients:", Object.keys(clients).length, JSON.stringify(req.body));
	const payload = JSON.stringify({title: req.body.title, content: req.body.content})
	const options = {
		TTL: req.body.ttl
	};
	// console.log(payload);
	if(Object.keys(clients).length == 0) {
		res.sendStatus(503)
	}
	else {
		Object.values(clients).forEach(el => {	
			webPush.sendNotification(el, payload, options)
				.then(res.sendStatus(201))
				.catch(err => console.error(err))
		})
	}
})

module.exports = router;