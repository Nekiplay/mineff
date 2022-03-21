const fs = require("fs");
const Vec3 = require("vec3");
module.exports = {
	name: "level",
	description: "Evaluates a given code.",
	aliases: ["lvl"],
	async run(bot, args, message) {
		const wait = async (ms) => new Promise(r => setTimeout(r, ms));
		let progress = Math.round(bot.experience.progress, -1);   // 55.6
		progress = Math.round(bot.experience.progress * 100) / 100
		let bottle_count = 0;
		let inventory = bot.inventory
		if (inventory != null)
		{
			for (let i = 9; i < 44; i++) 
			{
				let item = inventory.slots[i];
				if (item != null)
				{
					if (item.type == 940) 
					{
						bottle_count += item.count;
					}
				}
			}
			
		}
		bot.chat(`/msg ${message.author} Мой уровень - ${bot.experience.level} (${progress}%)`);
		bot.chat(`/msg ${message.author} Мой опыт - ${bot.experience.points}`);
		bot.chat(`/msg ${message.author} Пузырьков - ${bottle_count}`);
	}

}