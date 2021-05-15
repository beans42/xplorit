const fs = require('fs');
const express = require('express');
const https = require('https');
const socket = require('socket.io');
const crypto = require('crypto');

const port = 443;
const ssl_options = {
	key: fs.readFileSync('ssl/privkey.pem'),
	cert: fs.readFileSync('ssl/fullchain.pem'),
};

const app = express();
const server = https.createServer(ssl_options, app);
const io = socket(server);

let session_map = new Map();
let leaderboards = [];

app.get('/session/:session_id', (req, res) => {
	const session_id = req.params['session_id'];
	let session;
	if (session_map.has(session_id) && session_map.get(session_id).players === 0) {
		const session = session_map.get(session_id);
		res.render('room', { session_id, target: session.target, time: session.time });
	} else
		res.redirect('/invalid-page.html');
});

function generate_code(length) {
	const alpha = 'abcdefghijklmnopqrstuvwxyz';
	let bytes = crypto.randomBytes(length);
	let out = new Array(length);
	let cursor = 0;
	for (let i = 0; i < length; i++) {
		cursor += bytes[i];
		out[i] = alpha[cursor % alpha.length];
	}
	return out.join('');
}

const deg2rad = Math.PI / 180;
function calc_distance(start, dest) { //meters
	const dLat = (dest.latitude - start.latitude) * deg2rad;
	const dLon = (dest.longitude - start.longitude) * deg2rad;
	const lat1 = start.latitude * deg2rad;
	const lat2 = dest.latitude * deg2rad;
	const a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
	return (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) * 6371008.8;
}

io.on('connection', socket => {
	let session_id = '';
	let interval;
	interval = setInterval(() => {
		if (!session_id || !session_map.has(session_id))
			return;
		let session = session_map.get(session_id);
		session.time -= 1;

		session_map.set(session_id, session);
		socket.emit("time update", { time: session.time });
		if (session.time <= 0) {
			clearInterval(interval);
			socket.emit("lost");
		}
	}, 1000);

	socket.on('join room', data => {
		session_id = data.session_id;
		if (!session_id || !session_map.has(session_id))
			return;
		socket.join(session_id);
		session_map.get(session_id).players = 1;
		socket.emit('join acknowledgement');
		console.log('socket', socket.id, 'joined room', session_id);
	});

	socket.on('position update', pos => {
		if (!session_id || !session_map.has(session_id))
			return;
		const session = session_map.get(session_id);
		const target = session.target;
		const distance = calc_distance(pos, target);
		if (distance < 25 && session.time > 0) {
			socket.emit("victory", { points: (1/(session.time_og - session.time)) * 10 * session.radius });
		}
	});

	socket.on('disconnect', () => {
		if (!session_id || !session_map.has(session_id))
			return;
		let session = session_map.get(session_id);
		session.players = 0;
		session_map.set(session_id, session);
		console.log('socket', socket.id, 'left room', session_id);
	});
});

app.get('/create-room', (req, res) => {
	if (!('radius' in req.query) || !('time' in req.query) || !('latitude' in req.query) || !('longitude' in req.query)) {
		res.redirect('/invalid-page.html');
		return;
	}
	let { radius, time, latitude, longitude } = req.query;
	radius *= 1000;
	let session_id;
	do
	session_id = generate_code(6);
	while (session_map.has(session_id));

	var r = radius / 111300,
	y0 = parseFloat(latitude),
	x0 = parseFloat(longitude),
	v = Math.random(),
	t = 2 * Math.PI * v,
	x = r * Math.cos(t),
	y1 = r * Math.sin(t),
	x1 = x / Math.cos(y0);
	newY = y0 + y1;
	newX = x0 + x1;

	let session = {
		radius,
		players: 0,
		position: { longitude, latitude },
		target: { longitude: newX, latitude: newY },
		time: time * 60,
		time_og: time * 60,
		distance: radius
	};
	session_map.set(session_id, session);
	res.redirect('/session/' + session_id);
	console.log('room created with id', session_id);
});

app.get('/victory', (req, res) => {
	if (!('points' in req.query)) {
		res.redirect('/invalid-page.html');
		return;
	}
	const { points } = req.query;
	res.render('victory', { points });
});

app.get('/add-points', (req, res) => {
	if (!('points' in req.query) || !('nick' in req.query) || !('code' in req.query)) {
		res.redirect('/invalid-page.html');
		return;
	}
	let { points, nick, code } = req.query;
	points = parseInt(points);
	const index = leaderboards.findIndex((e) => e.nick === nick);
	if (index != -1) {
		if (code === leaderboards[index].code)
			leaderboards[index].points += points;
	} else leaderboards.push({ points, nick, code });
	leaderboards.sort((a, b) => {
		if (a.points > b.points)
			return -1;
		if (a.points < b.points)
			return 1;
		return 0;
	});
	res.redirect('/leaderboard');
});

app.get('/leaderboard', (req, res) => {
	let leaderboard = leaderboards.slice(0, 9);
	leaderboard.forEach((item, index) => item.idx = '#' + (index + 1));
	res.render('leaderboard', { leaderboard });
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
server.listen(port);