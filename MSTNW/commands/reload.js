const fs = require("fs");

module.exports = {
	name: "reload",
	description: "Reloads a commands from files.",
	aliases: ["rc", "update", "upd"],
	run(bot, args, message) {
		bot.chat(`/msg ${message.author} Reloading...`);
		// bot.scriptStorage = {};
		global.commands = new Map();
		const errors = [];
		for (const file of fs.readdirSync("./commands")) {
			if (!file.endsWith(".js")) return;
			delete require.cache[require.resolve(`../commands/${file}`)];
			try {
				const command = require(`../commands/${file}`);
				global.commands.set(command.name, command);
			} catch (error) {
				errors.push(file);
				console.error(error);
			}
		}
		if (errors.length == global.commands.size) {
			bot.chat(`/msg ${message.author} Failed to reload all commands!`);
			return;
		} else if (errors.length > 1) {
			bot.chat(`/msg ${message.author} Failed to reload multiple commands: ${errors.join(", ")}`);
		} else if (errors.length == 1) {
			bot.chat(`/msg ${message.author} Failed to reload ${errors[0]}`);
		} else {
			bot.chat(`/msg ${message.author} Successfully reloaded all commands!`);
		}
	}
}