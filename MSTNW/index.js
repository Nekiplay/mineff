const fs = require("fs");
const config = require("./config.json");
const BotClient = require("./components/BotClient.js");

// process.on("uncaughtException", (err) => {});
// process.on("unhandledRejection", (err) => {});

global.commands = new Map();

fs.readdirSync("./commands").forEach(file => {
	if (!file.endsWith(".js")) return;
	try {
		const command = require(`./commands/${file}`);
		global.commands.set(command.name, command);
	} catch (error) {
		console.log(`\x1b[31mError at loading file ${file}\x1b[0m`);
		console.error(error);
	}
})

const start = (bot) =>{
	const pos = bot.entity.position;
	if(Math.max(pos.x,config.home.x)-Math.min(pos.x,config.home.x)>20 || Math.max(pos.z,config.home.z)-Math.min(pos.z,config.home.z)>20 || Math.max(pos.y,config.home.y)-Math.min(pos.y,config.home.y)>20){
		console.log("бот в пизде");
	}else{
		console.log("Бот находится в доме");
		bot.chat("Хей, я дома!");
	}

	bot.on("messagestr", async (msg) => {
		const reg = /\[(.*?) -> (.*?)\] (.*)/;
		const match = msg.match(reg);
		if(!match) return;
		
		const message = {
			author: match[1],
			content: match[3]
		}

		if(!config.whitelist.includes(message.author)) return

		const args = message.content.split(" ");
		const commandString = args.shift();

		const command = Array.from(commands.values()).find(c => c.name == commandString || c.aliases.includes(commandString));
		if(!command) return;

		try {
			await command.run(bot, args, message);
			console.log(`RUN ${message.author} -> ${commandString} | ${args.join(", ")}`);
		} catch (e) {
			console.log(`ERROR ${message.author} -> ${commandString} | ${args.join(", ")}`);
			console.log(e);
		}

	});
}

new BotClient({
	username: config.mainUsername,
	password: config.mainPassword,
	config
}, start).run();