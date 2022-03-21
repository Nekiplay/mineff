const fs = require("fs");
const Vec3 = require("vec3");

let food = false;
let eb = false;
let start = new Date().getTime();

let start_time = new Date().getTime();

let exptime = new Date().getTime();

module.exports = {
	name: "attack",
	description: "Evaluates a given code.",
	aliases: ["a"],

	
	async run(bot, args, message) {
		
		let max_exptime = 0;
		
		var path = require('path')
		var express = require('express')
		var app = express()
		var server = require('http').createServer(app)
		const { Server } = require("socket.io");
		const io = require('socket.io').listen(server)
	
		const wait = async (ms) => new Promise(r => setTimeout(r, ms));
		let entity = bot.nearestEntity()
		
		let attacks = 0;
		
		attack(entity);
		
		bot.on("entitySpawn", (entity) => {
			eat();
		});
		
		let bottle_count = 0;
		
		io.set('log level', 0);
		
		io.sockets.on('connection', function (socket) {
			bot.on('physicTick', () => {
				socket.emit('health', bot.health);
				socket.emit('food', bot.food);
				socket.emit('money', balance);
				socket.emit('level', bot.experience.level);
				socket.emit('points', bot.experience.points);
				socket.emit('progress', bot.experience.progress);
				socket.emit('attacks', attacks);
				socket.emit('bottlexp', bottle_count);
				socket.emit('nickname', bot.username);
			});
			
			socket.on('message', function(message) {
				bot.chat(message)
			});
		});
		
		bot.on("physicTick", () => {
			let entity = bot.nearestEntity()
		});
		
		bot.on("entityMoved", (entity) => {
			eat();
			if (!eb && bot.experience.level >= 30)
			{
				eb = true;
				bot.chat(`/eb`);
			}
		});
		
		
		let balance = 0;
		
		const scoreUpdated = async (score) => {
			const sc = Object.values(score.itemsMap);
			if (sc != null)
			{
				const server = sc.find(s => s.name.includes("Баланс"));
				if(!server) return;
				const serverName = server.name.split("§6")[1].trim();
				balance = Number.parseInt(serverName.replace(".", ","));
			}
		}	
		
		bot.on("experience", () => {
			if (bot.experience.level == 0)
			{
				exptime = new Date().getTime() - start_time
				start_time = new Date().getTime();
				if (exptime > max_exptime)
				{
					max_exptime = exptime;
				}
			}
		})
		
		bot.on("scoreUpdated", scoreUpdated);
	
		//app.get('/', (req, res) => {
		//	res.sendFile(__dirname + '/public/index.html');
		//});
	
		app.use(express.static(path.join(__dirname, 'public')));
	
		server.listen(3778, function() {
			console.info("Listening at http://" + server.address().port);
		});
		
		
		//app.get('', (request, response) => {
		//	writeserver(request, response);
		//});
		
		function msToTime(s) {
			var ms = s % 1000;
			s = (s - ms) / 1000;
			var secs = s % 60;
			s = (s - secs) / 60;
			var mins = s % 60;
			var hrs = (s - mins) / 60;
			
			return hrs * -1 + ':' + mins  * -1 + ':' + secs * -1;
		}

		// 940
		
		const ebOpen = (window) => {
			if(window.title.includes("Обмен опыта")){
				bot.clickWindow(2, 1, 0);
				eb = false;
				bot.closeWindow(window);
			}
		}

		bot.on("windowOpen", ebOpen);
		
		bot.on("health", () => {
			eat();
		})
		
		bot.on("time", () => {
			drop();
		})
		
		function drop()
		{

		}
		
		function eat()
		{

			
		}
		
		function attack(entity){

		}

		
		function getRandomInt(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min)) + min;
		}
	}
}