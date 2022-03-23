const fs = require("fs");
const Vec3 = require("vec3");
const Discord = require('discord.js')

const range = 3;

const delay_min = 1250;
const delay_max = 1550;

let food = false;
let eb = false;
let start = new Date().getTime();

let start_time = new Date().getTime();

let exptime = new Date().getTime();
let lookAta = null;

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
		
		bot.on("physicTick", () => 
		{
			let best = null
    		let bestDistance = Number.MAX_VALUE

    		for (const entity of Object.values(bot.entities)) 
    		{
      			const dist = bot.entity.position.distanceSquared(entity.position)
      			if (dist < bestDistance && entity.type == "mob") 
      			{
        			best = entity
        			bestDistance = dist
      			}
    		}
			attack(best);		
		});

		bot.on("entityMoved", (entity) => {
			eat();
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
			if (bot.experience.level >= 30)
			{
				bot.chat(`/eb`);
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
			bottle_count = 0;
			let inventory = bot.inventory
			if (inventory != null)
			{
				for (let i = 9; i <= 44; i++) 
				{
					let item = inventory.slots[i];
					if (item != null)
					{
						if (item.type == 940) 
						{
							bottle_count += item.count;
						}
						else if (item.type != 719 && item.type != 764) 
						{
							bot.tossStack(item)
						}
					}
				}
				
			}
		}
		
		function eat()
		{
			// 764, 854
			if (bot.food == 20) 
			{
				food = false;
			}
			else if (!food)
			{
				try 
				{	
					let inventory = bot.inventory
					let item = inventory.slots[37];
					if (item != null)
					{
						bot.setQuickBarSlot(1)
						bot.consume()
						food = true;
					}
				}
				catch (e)
				{

				}
			}
			
		}
		
		function attack(entity){
			if (entity != null && entity.type == "mob" && bot.entity.position.distanceTo(entity.position) <= range && !food)
			{
				if (start - new Date().getTime() <= 0 && !food)
				{
					start = new Date().getTime() + getRandomInt(delay_min, delay_max);
					bot.setQuickBarSlot(0)
					console.log("Ударил: " + entity.name)
					lookAta = new Vec3(bot.entity.position.x, bot.entity.position.y + 1.6, bot.entity.position.z - 1)
					if (lookAta != null)
					{
						bot.lookAt(lookAta, true);
					}
					bot.attack(entity, true)
					attacks++;
				}
			}
			else
			{
				if (start - new Date().getTime() <= 0 && !food)
				{
					start = new Date().getTime() + getRandomInt(delay_min, delay_max);
					lookAta = new Vec3(bot.entity.position.x, bot.entity.position.y + 1.6, bot.entity.position.z - 1)
					if (lookAta != null)
					{
						bot.lookAt(lookAta, true);
					}
					bot.lookAt(lookAta, true);
					bot.swingArm("right");
				}
			}
		}

		
		function getRandomInt(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min)) + min;
		}
	}
}