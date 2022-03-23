
const mineflayer = require("mineflayer");
const mineflayerViewer = require("prismarine-viewer").mineflayer;
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const inventoryViewer = require('mineflayer-web-inventory')
const GoalFollow = goals.GoalFollow;
const GoalBlock = goals.GoalBlock;
const GoalNear = goals.GoalNear;
var vec = require('vec3');
var fs = require('fs');

/**
 * @typedef BotOptions
 * @property {string} username - bot username
 * @property {string} password - bot password
 * @property {Object} config - config.json
 */

class BotClient {
	/**
	 * Bot client constructor
	 * @param {BotOptions} options
	 * @param {function} start - callback function after bot is connected to anarchy server.
	 */
	constructor(options, start) {
		if (!options) throw new Error("Config is required");
		this.config = options.config;

		this.username = options.username;
		this.password = options.password;

		this.start = start;
		
		this.isMain = options.username == options.config.mainUsername ? true : false;
	}



	/**
	 * Connect to server
	 * @param {boolean} [reconnect] - if true, bot will reconnect to server
	 */
	run(reconnect = true) {
		const bot = mineflayer.createBot({
			host: this.config.host,
			username: this.username,
			//version: "1.12.2",
		//	keepAlive: false,
			colorsEnabled: false
		});

		
		function writeLog(logtext)
		{
			fs.appendFile("logs/" + "[" + new Date().toLocaleDateString() + "] " + "log.txt", "[" + new Date().toLocaleTimeString() + "] " + logtext, function (err)
			{
		
			});
		}

		console.log(`[${this.username}] Connecting to ${this.config.host}...`);
		
		 let options = {
			port: 3001,
		}
		

		bot.setMaxListeners(200);
		
		bot.once("spawn", () => {
			setTimeout(_=>{this.start(bot)} ,10000);
		})
		
		bot.loadPlugin(pathfinder);

		bot.once("login", () => {
			console.log(`[${this.username}] Connected to ${this.config.host}!`);
			writeLog("Зашел на сервер с ником: " + bot.username + "\n");
			inventoryViewer(bot, options)
			if(this.isMain) mineflayerViewer(bot, { port: 778, firstPerson: false });
			bot.scriptStorage = {};
			bot.mov = {};
			bot.mov.isMoving = false;
			bot.mov.pos = bot.entity.position.clone();
			bot.mov.time = new Date().getTime();
			global.mcData = require("minecraft-data")(bot.version);
		});	

		bot.on("messagestr", (message) => {
			console.log(message);
			writeLog(message + "\n");
			if(message.includes("/register (Пароль) (Пароль)")){
				bot.chat(`/register ${this.password} ${this.password}`);
			}else if(message.includes("/login (Пароль)")){
				bot.chat(`/login ${this.password}`);
			}
		});
		
		const windowOpen = (window) => {
			if(window.title == `{"text":"§8Выбор режима"}`){
				const it = window.slots.filter(slot => slot!=null && slot.type == 606);
				if(it.length == 0) return;
				window.requiresConfirmation = false;
				bot.clickWindow(it[0].slot, 1, 0);
			}
			else if(window.title.includes(`{"text":"§0§lАнархия`)){
				bot.pathfinder.stop();
				bot.moving = false;
				const it = window.slots.filter(slot => slot!=null && slot.type == 606);
				if(it.length == 0) return;
				const target = it.find(slot => slot.nbt.value.display.value.Name.value.includes(`Анархия-${this.config.anarhy}`));
				window.requiresConfirmation = false;
				bot.clickWindow(target.slot, 1, 0);
				writeLog("Захожу на " + this.config.anarhy + " анархию" + "\n");
			}
		}
		const scoreUpdated = async (score) => 
		{
			const sc = Object.values(score.itemsMap);
			if (sc != null)
			{
				const server = sc.find(s => s.name.includes("Сервер"));
				if(!server) return;
				const serverName = server.name.split("§6")[1].trim();
				if(serverName.includes("Спавн-"))
				{
					if(bot.moving) return;
					bot.moving = true;
					const movements = new Movements(bot, global.mcData);
					movements.scafoldingBlocks = [];
					bot.pathfinder.setMovements(movements);
					console.log(serverName)
					writeLog("Захожу на " + serverName + "\n");
					await bot.pathfinder.setGoal(new GoalNear(-10,102,17,0));
				}
				else if(serverName.includes("Анархия-"))
				{
					bot.pathfinder.stop();
					bot.moving = false;
				}
				else if(serverName.includes("Хаб-"))
				{
					const invcheck = setInterval(() => 
					{
						const it = bot.inventory.slots.filter(slot => slot!=null);
						if(it.length == 0) return;
						const compass = it.find(slot => slot.type == 795);
						if(compass){
							clearInterval(invcheck);
							bot.setQuickBarSlot(0);
							bot.activateItem();
						}
					}, 100);
				}
			}
		}	
		bot.on("windowOpen",windowOpen);
		bot.on("scoreUpdated", scoreUpdated);
		bot.on("physicTick", () => 
		{
			if(!bot.pathfinder.isMoving())
			{
				bot.mov.time = Infinity;
				return;
			};
			if (bot.entity.position.distanceTo(new vec(-10,102,17,0)) < 2)
			{
				bot.setControlState("jump", true);
				bot.setControlState("jump", false);
			}
			else if (bot.entity.position.distanceTo(bot.mov.pos) > 2) 
			{
				bot.setControlState("jump", false);
				console.log("bot is moving");
				bot.mov.pos = bot.entity.position.clone();
				bot.mov.time = new Date().getTime();
			}
		});
		bot.on("end", (reason) => {
			console.log(`[${this.username}] Disconnected from ${this.config.host}! Reason: ${reason}`);
			writeLog("Кикнуло с сервера, причина: " + reason + "\n");
			//bot.scriptStorage = {};
			bot.viewer?.close();
			//bot.removeAllListeners();
			if (reconnect) this.run();
		});
		bot.on("kicked", (reason) => {
			writeLog("Кикнуло с сервера, причина: " + reason + "\n");
			console.log(reason);
		});
	
	}
}

module.exports = BotClient;