const fs = require("fs");
const Vec3 = require("vec3");
const autoeat = require("mineflayer-auto-eat")

const range = 4;

const delay_min = 750;
const delay_max = 1250;

let food = false;
let eb = false;
let start = new Date().getTime();

module.exports = {
	name: "balance",
	description: "Evaluates a given code.",
	aliases: ["a"],
	
	
	async run(bot, args, message) {
		const scoreUpdated = async (score) => {
			const sc = Object.values(score.itemsMap);
			if (sc != null)
			{
				const server = sc.find(s => s.name.includes("Баланс"));
				if(!server) return;
				const serverName = server.name.split("§6")[1].trim();
				console.log(serverName.replace(".", ","))
				bot.chat("/msg " + message.author + " Баланс " + serverName.replace(".", ","));
				bot.removeListener("scoreUpdated", scoreUpdated);
			}
		}	
		
		bot.on("scoreUpdated", scoreUpdated);
		
		function getRandomInt(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min)) + min;
		}
	}
}