module.exports = {
	name: "reconnect",
	description: "Reconnects the bot to the server.",
	aliases: [ "re","reconnect"],
	run(bot, args, message) {
		bot.chat(`/msg ${message.author} Reconnecting...`);
		bot.end();
	}
}