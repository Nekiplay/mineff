const fs = require("fs");
const Vec3 = require("vec3");

module.exports = {
	name: "drop",
	description: "Evaluates a given code.",
	aliases: ["d"],
	
	
	async run(bot, args, message) {
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
		if (bottle_count > 0)
		{
			bot.toss(940, null, bottle_count)
		}
	}
}