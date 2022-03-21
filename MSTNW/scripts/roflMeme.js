const BotClient = require("../components/BotClient.js");
const config = require("../config.json");

const password="GaySexLover";

const usernames = [
	"RetardedMorron",
	// "collinMccoy",
	// "rektMeme",
]

for (const [username,i] of usernames) {
	const botClient = new BotClient({username, password, config}, (client) => {
		setTimeout(() => {
			client.chat("/tpa SainEyereg");
			setTimeout(() => {
				client.chat("Понос очень вкусно!");
				//client.end();
			}, 5000);
		}, 3000*i);
	});
	botClient.run(false);
}