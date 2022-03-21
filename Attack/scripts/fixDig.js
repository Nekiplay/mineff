const Vec3 = require("vec3");
const bo = bot.blockAt(new Vec3(bot.entity.position.x,bot.entity.position.y-2,bot.entity.position.z));
bot.dig(bo).catch(() => {});
setTimeout(() => {
	bot.stopDigging();
}, 1000);