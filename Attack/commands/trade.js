const fs = require("fs");

module.exports = {
	name: "trade",
	description: "Findings cheapest item and trade it for bigger price",
	aliases: ["t","ahbot"],
	async run(bot, args, message) {
		const wait = async (ms) => new Promise(r => setTimeout(r, ms));
		const config = require("../config.json");

		if (args[0] == "stop") {
			if (bot.scriptStorage.onTrade) {
				bot.scriptStorage.onTrade = false;
				bot.chat(`/msg ${message.author} Task stoped!`);
			} else bot.chat(`/msg ${message.author} Task is not running!`);
			return;
		}

		if (bot.scriptStorage.onTrade) return bot.chat(`/msg ${message.author} Task is already running!`);

		bot.scriptStorage.onTrade = true;
		bot.chat(`/msg ${message.author} Task started!`);
		
		const OlejkaParser = {
			/**
			 * Проверяет находится ли в NBT заданная строка
			 * @param {Object} item - Объект в окне
			 * @param {String} str - Фраза для поиска
			 * @returns 
			 */
			hasNBT(item, str) {
				if (!item || !str) throw Error("No args kurwa!");
				return JSON.stringify(item?.nbt?.value).includes(str)
			},
			/**
			 * Возвращает цену
			 * @param {Object} item - Объект в окне
			 * @param {Boolean} stack - Цена за стак
			 * @returns 
			 */
			price(item, stack=false) {
				const priceString = item?.nbt?.value?.display?.value?.Lore?.value?.value?.find(l => l.includes(stack ? "Общая стоимость:" : "Стоимость за шт:"));
				return parseFloat(JSON.parse(priceString).extra[0].extra[1].text);
			}
		}

		let lastWindow;
		const nextPage = (window, callback) => {
			const nextButton = window.slots.find(i => i.name == "spectral_arrow" && OlejkaParser.hasNBT(i, "Листнуть вперед"));
			lastWindow = window.slots;
			bot.clickWindow(nextButton, 1, 0);
			wait(1000).then(() => {if (lastWindow != window.slots) callback(window)});
		}

		const check = (window) => { // Проверим, на аукционе ли мы
			console.log(2);
			if(window.title == `{"text":"§0§lАукцион"}`){
				const allowed = Object.keys(config.trade.items);
				console.log(allowed)
				const it = window.slots.filter(slot => slot !== null && allowed.includes(slot.name.toLowerCase()));
				if(it.length == 0) nextPage(window, check);

				console.log(it)
			}
		}

		const windowOpen = (window) => {
			console.log(1)
			check(window);
			bot.removeListener("windowOpen",windowOpen);
		}
		bot.on("windowOpen",windowOpen);

		bot.chat("/ah");
		
	}
};