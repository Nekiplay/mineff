if (!bot.scriptStorage.sneaking) {
	bbot.scriptStorage.sneaking = true;
	let snaked = false;
	function snake() {
		if (snaked) {bot.setControlState("sneak", false); snaked = false;}
		else {bot.setControlState("sneak", true); snaked = true;}
		console.log("snaking "+snaked);
	}
	bot.scriptStorage.sneakingInterval = setInterval(snake, 100);
} else {
	clearInterval(bot.scriptStorage.sneakingInterval);
	bot.setControlState("sneak", false)
	bot.scriptStorage.sneaking = false;
}
