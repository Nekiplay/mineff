module.exports = {
	name: "say",
	description: "Says something",
	aliases: ["s","tell","speak","talk"],
	run(bot, args, message) {
		bot.chat(args.join(" "));
	}
}