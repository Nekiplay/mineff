const Discord = require('discord.js')
const fs = require('fs')

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]})
const fetch = require('node-fetch')

client.commands = new Discord.Collection() // создаём коллекцию для команд

const full_heath = "<:full:955956470019657792>";
const half_heath = "<:half:955956484632637440>";
const empty_heath = "<:empty:955959093057708072>";

const full_food = "<:full_food:955960923573604392>";
const half_food = "<:not_full_food:955960923565215795>";
const empty_food = "<:empty_food:955960923728789535>";

const xp_not_full1 = "<:exp_leftborder_empty:955978873563131925>";
const xp_not_full2 = "<:exp_rightborder_empty:955978873613451394>";
const xp_not_full3 = "<:exp_middleborder_empty:955978873613484062>";

const xp_full1 = "<:exp_leftborder_full:955973145481842768>";
const xp_full2 = "<:exp_rightborder_full:955973145385394186>";
const xp_full3 = "<:exp_middleborder_full:955973145389568111>";

let start = new Date().getTime();


module.exports = {
	name: "discord2",
	description: "Discord bot.",
	aliases: ["discord"],

	
	async run(bot, botargs, test) {
		var enable = false;
		client.on('ready', () => {
    		console.log(`Дискор бот ${client.user.username} запустился`);
    		enable = true;
		})

		client.on('messageCreate', message => 
		{

		})

		bot.on("time", () => 
		{
			if (enable)
			{
				update(false);
  			}
		});

		bot.on("health", () => 
		{
			if (enable)
			{
				update(true);
  			}
		});

		var old = bot.experience.progress;
		function update(health)
		{
			if (start - new Date().getTime() <= 0)
			{
				if (old != bot.experience.progress || health)
				{
					old = bot.experience.progress;
					start = new Date().getTime() + 1000 * 4;
					let info = "";
					info += getHealth(bot.health, full_heath, half_heath, empty_heath) + " " + getFormatterNumber("" + bot.experience.level) + " " + getFood(bot.food, full_food, half_food, empty_food) + "\n" + "              " + createXp() + "\n";
					const exampleEmbed = new Discord.MessageEmbed() // Создаём наш эмбэд
					.setColor('#00ff00') // Цвет нашего сообщения
					.setTitle(getCenter("Информация об аккаунте")) // Название эмбэд сообщения
					.setDescription(info)
					.setTimestamp()
					console.log("Уровень: " + bot.experience.level)
					client.channels.cache.get('956001068653875340').messages.fetch('956007174264463420').then((msg) => msg.edit({ embeds: [exampleEmbed] }));	
				}
			}	
		}

 	


	function getFormatterNumber(number)
	{
		var done = "";
		// 
		for (var i = 0; i < number.length; i++)
		{
			let char = number.charAt(i);
			if (char == "0")
			{
				done += "<:xp_0:955986589543194644>";
			}
			else if (char == "1")
			{
				done += "<:xp_1:955986589631275028>";
			}
			else if (char == "2")
			{
				done += "<:xp_2:955986589769695242>";
			}
			else if (char == "3")
			{
				done += "<:xp_3:955986589459288127>";
			}
			else if (char == "4")
			{
				done += "<:xp_4:955986589576740884>";
			}
			else if (char == "5")
			{
				done += "<:xp_5:955986589673218048>";
			}
			else if (char == "6")
			{
				done += "<:xp_6:955986589664809010>";
			}
			else if (char == "7")
			{
				done += "<:xp_7:955986589580939264>";
			}
			else if (char == "8")
			{
				done += "<:xp_8:955986589576745021>";
			}
			else if (char == "9")
			{
				done += "<:xp_9:955986589543202916>";
			}
		}
		return done;
	}

	function createXp()
	{
		var progress = bot.experience.progress;
		console.log(progress + " | " + progress * 18)
		var done = "";

		var progress2 = progress * 18;

		if (progress * 18 >= 1)
		{
			done += xp_full1;
		}
		else
		{
			done += xp_not_full1;
		}
		progress2 = progress * 18;
		var rem = 0;
		for (var i = 0; i < 16; i++)
		{
			rem++;
			if (progress * 18 - rem > 0.9)
			{
				done += xp_full3;
			}
			else
			{
				done += xp_not_full3;
			}
		}
		done += xp_not_full2;
		return done;
	}

	function getCenter(string)
	{
		var done = "";
		for (var i = 0; i < (209 / 2) - (string.length * 4); i++)
		{
			done += "_ _ ";
		}
		done += string;
		return done;
	}
	function getHealth(type, health_full, health_half, health_empty)
	{
		var health = type / 2
		var s = "";
		try {
  			s = (health+'').split(".")[1].substr(0,1);
		} 
		catch (e) { }
		var addeded = 0;

		let done = "";
		for (var i = 0; i < parseInt(health, 10); i++)
		{
			done += health_full;
			addeded++;
		}
		if (s != "")
		{
			done += health_half;
			addeded++;
		}

		for (var i = addeded; i < 10; i++)
		{
			done += health_empty;
		}
		return done;
	}
	function getFood(type, health_full, health_half, health_empty)
	{
		var health = type / 2
		let done = "";
		var s = "";
		try 
		{
  			s = (health+'').split(".")[1].substr(0,1);
		} 
		catch (e) { }
		var addeded = 0;


		var fruits = [];
		if (s != "")
		{
			addeded++;
		}
		for (var i = addeded; i < parseInt(health, 10); i++)
		{
			fruits.push(health_full);
			addeded++;
		}
		if (s != "")
		{
			fruits.push(health_half);
		}
		for (var i = addeded++; i < 10; i++)
		{
			fruits.push(health_empty);
		}
		fruits = fruits.reverse()


		console.log(done)
		return fruits.join("");
	}
	function getProgress()
	{
		let progress = Math.round(bot.experience.progress, -1);   // 55.6
		progress = Math.round(bot.experience.progress * 100) / 100
		return progress;
	}

	function getBottleCount()
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
				}
			}
		}
		return bottle_count;
	}

		client.login("OTU1OTEwMjUzNTc5NDgxMDk4.YjoizA.BG5d8RuCoFpIvrjmj0Yxj45N1OY")
	}
}