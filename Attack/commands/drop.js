const fs = require("fs");
const Vec3 = require("vec3");
const autoeat = require("mineflayer-auto-eat")

module.exports = {
	name: "drop",
	description: "Evaluates a given code.",
	aliases: ["d"],
	
	
	async run(bot, args, message) {
		let inventory = bot.inventory
		let item_index = args[0]
		let item = inventory.slots[item_index];
		if (item != null)
		{
			bot.tossStack(item)
			console.log(item.displayName)
			bot.chat("/msg " + message.author + " Выкидываю предмет из инвентаря " + item.displayName);
		}
		else
		{
			bot.chat("/msg " + message.author + " Нету придмета в этом слоте");
		}
	}
}