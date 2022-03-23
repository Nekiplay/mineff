const Discord = require('discord.js')
const fs = require('fs')

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]})
const fetch = require('node-fetch')

client.commands = new Discord.Collection() // создаём коллекцию для команд



module.exports = {
	name: "discord",
	description: "Discord bot.",
	aliases: ["discord"],

	
	async run(bot, botargs, test) {
		fs.readdir('./commands/discord_commands', (err, files) => 
		{ 
   			if (err) console.log(err)

    		let jsfile = files.filter(f => f.split('.').pop() === 'js') // файлы не имеющие расширение .js игнорируются
    		if (jsfile.length <= 0) return console.log('Команды не найдены!') // если нет ни одного файла с расширением .js

   			console.log(`Загружено ${jsfile.length} команд`)
    		jsfile.forEach((f, i) => 
    		{
    		console.log("Загружаю дискорд команду: " + `${f}`)
       		let props = require(`./discord_commands/${f}`)
        	client.commands.set(props.help.name, props)
    		})
		})


		client.on('ready', () => {
			client.user.setPresence({ activities: [{ name: 'Я твой рот переворот' }], status: 'PLAYING' });
    		console.log(`Дискор бот ${client.user.username} запустился`);
		})

		client.on('messageCreate', message => 
		{
    		let prefix = ">"
    		if (!message.content.startsWith(prefix) || message.author.bot) return;
    		let messageArray = message.content.split(' ') // разделение пробелами
    		let command = messageArray[0] // команда после префикса
    		let args = messageArray.slice(1) // аргументы после команды

    		let command_file = client.commands.get(command.slice(prefix.length)) // получение команды из коллекции
    		if (command_file) 
    		{ 
    			command_file.run(bot, client, message, args, prefix)
    			message.delete()
    		}
		})

		client.login("OTU1OTEwMjUzNTc5NDgxMDk4.YjoizA.BG5d8RuCoFpIvrjmj0Yxj45N1OY")
	}
}