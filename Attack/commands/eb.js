const Vec3 = require("vec3");
const config = require("../config.json");

module.exports = {
    name: "eb",
    description: "Bypasses OreFuscator and search valid ore blocks.",
	aliases: ["eb"],
	async run(bot, args, message) {
		const wait = async (ms) => new Promise(r => setTimeout(r, ms));

		const ebOpen = (window) => {
			if(window.title.includes("Обмен опыта")){
				bot.clickWindow(2, 1, 0);
				bot.closeWindow(window);
			}
		}

		bot.on("windowOpen", ebOpen);

		bot.chat(`/eb`);
	}
}