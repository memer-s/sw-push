import webPush from 'web-push';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
const app = express();
dotenv.config();

webPush.setVapidDetails('https://serviceworke.rs/', process.env.PUBLIC_KEY, process.env.PRIVATE_KEY);

app.use(cors({origin: 'http://localhost:5500'}));
app.use(express.json());

app.get('/', (req, res) => {
	res.sendFile(`C:/Users/mimer/Desktop/webdev/Service Workers/index.html`)
})

app.get('/sw.js', (req, res) => {
	res.sendFile(`C:/Users/mimer/Desktop/webdev/Service Workers/sw.js`)
})

app.get('/main.js', (req, res) => {
	res.sendFile(`C:/Users/mimer/Desktop/webdev/Service Workers/main.js`)
})

app.get('/test', (req, res) => {
	res.sendFile(`C:/Users/mimer/Desktop/webdev/Service Workers/test.html`)
})

let clients = []

app.get('/vapidPublicKey', (req,res) => {
	res.send(process.env.PUBLIC_KEY)
})

app.post('/register', (req, res) => {
	console.log(req.body.subscription);
	clients.push(req.body.subscription);
	res.sendStatus(201);
})

app.post('/sendNotification', (req, res) => {
	const subscription = req.body.subscription;
	console.log(subscription);
	const payload = JSON.stringify({title: 'Memer.eu', content: 'CRINGE ASS'});
	const options = {
		TTL: req.body.ttl
	};
	setTimeout(() => {
		webPush.sendNotification(subscription, payload, options).then(res.sendStatus(201)).catch(err => console.error(err))
	}, 500)
})

app.post('/sendNotifications', (req, res) => {
	console.log(req.body);
	const payload = JSON.stringify({title: req.body.title, content: req.body.content})
	const options = {
		TTL: req.body.ttl
	};
	console.log(payload);
	clients.forEach(el => {	
		webPush.sendNotification(el, payload, options).then(res.sendStatus(201)).catch(err => console.error(err))
	})
})

app.listen(3000, () => {
	console.log("Listening on port 3000");	
});