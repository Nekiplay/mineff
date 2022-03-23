const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, client,message,args,prefix) =>
 {

 	let content = "";
 	for (const entity of Object.values(bot.entities)) 
    {
      	const dist = bot.entity.position.distanceTo(entity.position)
      	if (entity.type == "player" && entity != bot.entity) 
      	{
        	content += "" + entity.username + " [" + getRound(dist) + "]" + "\n";
      	}
    }

    function getRound(roundsa)
	{
		let progress = Math.round(roundsa, -1);   // 55.6
		progress = Math.round(roundsa * 10) / 10
		return progress;
	}

	const exampleEmbed = new Discord.MessageEmbed() // Создаём наш эмбэд
		.setColor('#00ff00') // Цвет нашего сообщения
		.setTitle('Игроки поблизости') // Название эмбэд сообщения
		.setDescription(content)
		.setTimestamp() // Дата  отправки сообщения

	message.channel.send({ embeds: [exampleEmbed] }); // Отправляем сообщение
};
module.exports.help = {
    name: "players" // Название команды
};