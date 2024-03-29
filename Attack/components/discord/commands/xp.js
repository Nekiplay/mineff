const Discord = require("discord.js");
const fs = require("fs");

const xp = "<:exp:955999972006985770>";

module.exports.run = async (bot, client,message,args,prefix) =>
{

 	let content = "";
 	let info = "";
 	info += "" + xp + " " + getFormatterNumber("" + getBottleCount())

	const exampleEmbed = new Discord.MessageEmbed() // Создаём наш эмбэд
		.setColor('#00ff00') // Цвет нашего сообщения
		.setTitle(getCenter("Количество пузырьков опыта")) // Название эмбэд сообщения
		.setDescription(info)
		.setTimestamp() // Дата  отправки сообщения
	message.channel.send({ embeds: [exampleEmbed] }); // Отправляем сообщение


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
};
module.exports.help = {
    name: "xp" // Название команды
};