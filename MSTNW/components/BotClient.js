
const mineflayer = require("mineflayer");
const mineflayerViewer = require("prismarine-viewer").mineflayer;
const { pathfinder, Movements, goals } = require("mineflayer-pathfinder");
const inventoryViewer = require('mineflayer-web-inventory')
const GoalFollow = goals.GoalFollow;
const GoalBlock = goals.GoalBlock;
const GoalNear = goals.GoalNear;
var vec = require('vec3');
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
		
		console.log(`[${this.username}] Connecting to ${this.config.host}...`);
		
		 let options = {
			port: 3000,
		}
		

		bot.setMaxListeners(200);
		
		
		bot.once("spawn", () => {
			
			setTimeout(_=>{this.start(bot)} ,2000);
		})
		
		bot.loadPlugin(pathfinder);

		bot.once("login", () => {
			console.log(`[${this.username}] Connected to ${this.config.host}!`);
			inventoryViewer(bot, options)
			if(this.isMain) mineflayerViewer(bot, { port: 777, firstPerson: false });
			bot.scriptStorage = {};
			bot.mov = {};
			bot.mov.isMoving = false;
			bot.mov.pos = bot.entity.position.clone();
			bot.mov.time = new Date().getTime();
			global.mcData = require("minecraft-data")(bot.version);
			const invcheck = setInterval(() => {
				const it = bot.inventory.slots.filter(slot => slot!=null);
				if(it.length == 0) return;
				const compass = it.find(slot => slot.type == 795);
				if(compass){
					clearInterval(invcheck);
					bot.setQuickBarSlot(0);
					bot.activateItem();
				}
			}, 100);
		});
		


		bot.on("messagestr", (message) => {
			console.log(message);
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
				bot.clickWindow(it[0].slot, 1, 0);
			}else if(window.title.includes(`{"text":"§0§lАнархия`)){
				bot.pathfinder.stop();
				setTimeout(() => {
					bot.moving = false;
					const it = window.slots.filter(slot => slot!=null && slot.type == 606);
					if(it.length == 0) return;
					const target = it.find(slot => slot.nbt.value.display.value.Name.value.includes(`Анархия-${this.config.anarhy}`));
					bot.clickWindow(target.slot, 1, 0);
				}, 150);
				
			}
		}
		const scoreUpdated = async (score) => {
			const sc = Object.values(score.itemsMap);
			if (sc != null)
			{
				if(sc.find(s => s.name.includes("Хаб"))) console.log(sc.find(s => s.name.includes("Хаб")).name);
				const server = sc.find(s => s.name.includes("Сервер"));
				if(!server) return;
				const serverName = server.name.split("§6")[1].trim();
				if(serverName.includes("Спавн-")){
					if(bot.moving) return;
					bot.moving = true;
					const movements = new Movements(bot, global.mcData);
					movements.scafoldingBlocks = [];
					bot.pathfinder.setMovements(movements);
					console.log(serverName)
					await bot.pathfinder.setGoal(new GoalNear(-10,102,17,0));
				}
				else if(serverName.includes("Анархия-")){
					//bot.removeListener("scoreUpdated", scoreUpdated);
					//bot.removeListener("windowOpen", windowOpen);
					//setTimeout(_=>{this.start(bot)} ,2000);
				}
			}
		}	
		bot.on("windowOpen",windowOpen);
		bot.on("scoreUpdated", scoreUpdated);
		bot.on("physicTick", () => {
			if(!bot.pathfinder.isMoving()) {
				bot.mov.time = Infinity;
				return;
			};
			if (bot.entity.position.distanceTo(bot.mov.pos) > 1) 
			{
				bot.setControlState("jump", false);
				console.log("bot is moving");
				bot.mov.pos = bot.entity.position.clone();
				bot.mov.time = new Date().getTime();
			}
			if (bot.entity.position.distanceTo(bot.mov.pos) > 3)
			{
				bot.setControlState("jump", true);
				bot.setControlState("jump", false);
			}
			if (new Date().getTime() - bot.mov.time > 1000 && !bot.pathfinder.isMining() && !bot.pathfinder.isBuilding()) {
				// console.log("bot is stuck");
				// bot.pathfinder.stop();
			}
		});
		bot.on("end", (reason) => {
			console.log(`[${this.username}] Disconnected from ${this.config.host}! Reason: ${reason}`);
			//bot.scriptStorage = {};
			bot.viewer?.close();
			//bot.removeAllListeners();
			if (reconnect) this.run();
		});
		bot.on("kicked", (reason) => {
			console.log(reason);
		});
	
	}
}

module.exports = BotClient;