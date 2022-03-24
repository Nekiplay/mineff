const Discord = require("discord.js");
const fs = require("fs");
const assets = require("./assets.json");

const commands = new Discord.Collection();
const files = fs.readdirSync("./components/discord/commands");
files.forEach(file => {
	if (!file.endsWith(".js")) return;
	let props = require(`./commands/${file}`);
	commands.set(props.help.name, props);
})

class DiscordBot {
	constructor(bot) {
		this.bot = bot;
		this.enabled = false;
	}
	async start() {
		const client = this.client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

		const {bot} = this;
		const {discord: {token, prefix, channel}} = require("../../config.json");
		

		client.on("ready", () => {
			client.user.setPresence({
				activities: [{ name: "Я твой рот переворот" }],
				status: "PLAYING",
			});
			console.log(`Дискор бот ${client.user.username} запустился`);
			this.enabled = true;
		});

		client.on("messageCreate", (message) => {
			if (!message.content.startsWith(prefix) || message.author.bot) return;
			let messageArray = message.content.split(" "); // разделение пробелами
			let command = messageArray[0]; // команда после префикса
			let args = messageArray.slice(1); // аргументы после команды
		
			let command_file = commands.get(command.slice(prefix.length)); // получение команды из коллекции
			if (command_file) {
				command_file.run(bot, client, message, args, prefix);
				message.delete();
			}
		});
		
		function getCenter(string) {
			let done = "";
			for (let i = 0; i < 209 / 2 - string.length * 4; i++) {
				done += "_ _ ";
			}
			done += string;
			return done;
		}
		

		function getBottleCount() {
			bottle_count = 0;
			let inventory = bot.inventory;
			if (inventory != null) {
				for (let i = 9; i <= 44; i++) {
					let item = inventory.slots[i];
					if (item != null) {
						if (item.type == 940) {
							bottle_count += item.count;
						}
					}
				}
			}
			return bottle_count;
		}
		
		function getFormatterNumber(number) {
			let done = "";
			//
			for (let i = 0; i < number.length; i++) {
				done += assets.xp[number.charAt(i)];
			}
			return done;
		}
		
		function createXp() {
			let progress = bot.experience.progress;
			console.log(progress + " | " + progress * 18);
			let done = "";
		
			let progress2 = progress * 18;
		
			if (progress * 18 >= 1) {
				done += assets.xp.full_left;
			} else {
				done += assets.xp.empty_left;
			}
			progress2 = progress * 18;
			let rem = 0;
			for (let i = 0; i < 16; i++) {
				rem++;
				if (progress * 18 - rem > 0.9) {
					done += assets.xp.full_middle;
				} else {
					done += assets.xp.empty_middle;
				}
			}
			done += assets.xp.empty_right;
			return done;
		}
		
		function getCenter(string) {
			let done = "";
			for (let i = 0; i < 209 / 2 - string.length * 4; i++) {
				done += "_ _ ";
			}
			done += string;
			return done;
		}
		function getHealth(type, health_full, health_half, health_empty) {
			let health = type / 2;
			let s = "";
			try {
				s = (health + "").split(".")[1].substr(0, 1);
			} catch (e) {}
			let addeded = 0;
		
			let done = "";
			for (let i = 0; i < parseInt(health, 10); i++) {
				done += health_full;
				addeded++;
			}
			if (s != "") {
				done += health_half;
				addeded++;
			}
		
			for (let i = addeded; i < 10; i++) {
				done += health_empty;
			}
			return done;
		}
		function getFood(type, health_full, health_half, health_empty) {
			let health = type / 2;
			let done = "";
			let s = "";
			try {
				s = (health + "").split(".")[1].substr(0, 1);
			} catch (e) {}
			let addeded = 0;
		
			let fruits = [];
			if (s != "") {
				addeded++;
			}
			for (let i = addeded; i < parseInt(health, 10); i++) {
				fruits.push(health_full);
				addeded++;
			}
			if (s != "") {
				fruits.push(health_half);
			}
			for (let i = addeded++; i < 10; i++) {
				fruits.push(health_empty);
			}
			fruits = fruits.reverse();
		
			console.log(done);
			return fruits.join("");
		}
		
		function getProgress() {
			let progress = Math.round(bot.experience.progress, -1); // 55.6
			progress = Math.round(bot.experience.progress * 100) / 100;
			return progress;
		}
	
		function getBottleCount() {
			let bottle_count = 0;
			let inventory = bot.inventory;
			if (inventory != null) {
				for (let i = 9; i <= 44; i++) {
					let item = inventory.slots[i];
					if (item != null) {
						if (item.type == 940) {
							bottle_count += item.count;
						}
					}
				}
			}
			return bottle_count;
		}
		
		
		let xpOld = bot.experience.progress;
		let start = new Date().getTime();
		function updateMain(health) {
			if (start - new Date().getTime() <= 0) {
				if (xpOld != bot.experience.progress || health) {
					xpOld = bot.experience.progress;
					start = new Date().getTime() + 1000 * 4;
					let info = "";
					info +=
						getHealth(bot.health, assets.health.full, assets.health.half, assets.health.empty) +
						" " +
						getFormatterNumber("" + bot.experience.level) +
						" " +
						getFood(bot.food, assets.food.full, assets.food.half, assets.food.empty) +
						"\n" +
						"              " +
						createXp() +
						"\n";
					const exampleEmbed = new Discord.MessageEmbed() // Создаём наш эмбэд
						.setColor("#00ff00") // Цвет нашего сообщения
						.setTitle(getCenter("Информация об аккаунте")) // Название эмбэд сообщения
						.setDescription(info)
						.setTimestamp();
					console.log("Уровень: " + bot.experience.level);
					client.channels.cache
						.get(channel)
						.messages.fetch("956007174264463420")
						.then((msg) => msg.edit({ embeds: [exampleEmbed] })).catch(e => {
							
						})
				}
			}
		}

		let btOld = getBottleCount();
		function updateBottle() {
			if (start - new Date().getTime() <= 0) {
				if (btOld != getBottleCount()) {
					btOld = getBottleCount();
					start = new Date().getTime() + 1000 * 1;
					let info = "";
					info +=
						"" +
						assets.xp.bottle +
						" " +
						getFormatterNumber("" + getBottleCount());
					const exampleEmbed = new Discord.MessageEmbed() // Создаём наш эмбэд
						.setColor("#00ff00") // Цвет нашего сообщения
						.setTitle(getCenter("Количество пузырьков опыта")) // Название эмбэд сообщения
						.setDescription(info)
						.setTimestamp();
					console.log(getBottleCount());
					client.channels.cache
						.get(channel)
						.messages.fetch("956011290256621618")
						.then((msg) => msg.edit({ embeds: [exampleEmbed] })).catch(e => {

						})
				}
			}
		}
		bot.on("time", () => {
			if (this.enabled) {
				updateMain(false);
				updateBottle();
			}
		});

		bot.on("health", () => {
			if (this.enabled) {
				updateMain(true);
			}
		});
		client.login(token);
	}
	async destroy() {
		await this.client.destroy();
	}
}

module.exports = DiscordBot;