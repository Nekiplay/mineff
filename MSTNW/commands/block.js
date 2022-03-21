const Vec3 = require("vec3");
const config = require("../config.json");

module.exports = {
    name: "block",
    description: "Bypasses OreFuscator and search valid ore blocks.",
	aliases: ["b","search","find","findblock", "dig"],
	async run(bot, args, message) {
		const wait = async (ms) => new Promise(r => setTimeout(r, ms));

		if (args[0] == "stop") {
			if (bot.scriptStorage.dig) {
				bot.scriptStorage.dig = false;
				bot.stopDigging();
				bot.chat(`/msg ${message.author} Task stoped!`);
			} else bot.chat(`/msg ${message.author} Task is not running!`);
			return;
		}
		if(bot.scriptStorage.dig) return bot.chat(`/msg ${message.author} Task is already running!`);
		const r = parseInt(args[0]) || config.finder.radius;
		bot.scriptStorage.dig = true;
		bot.chat(`/msg ${message.author} Task started!`);

		const potencialObfOre = ["gold_ore","lapis_ore","diamond_ore","emerald_ore","obsidian","bookshelf", "netherrack", "dirt"];
		async function check(x,y,z){
			if(!bot.scriptStorage.dig) return;
			const bo = bot.blockAt(new Vec3(x,y,z));
			if(!bo) return;
			if(!potencialObfOre.includes(bo.name)) return;
			// sent dig packet using bot._client.write()
			bot.dig(bo,"ignore").catch(() => {});
			await wait(45);
			bot.stopDigging();
			wait(500).then(_=>{
				const bn = bot.blockAt(new Vec3(x,y,z));
				if(!bn) return;
				console.log(`${x} ${y} ${z} | ${bo.name} | ${bn.name} | potencialObfOre: ${potencialObfOre.includes(bo.name)}`);
				if(bo.name==bn.name) return;
				if(config.finder.whitelist.includes(bn.name)) bot.chat(`/msg ${message.author} ${x} ${y} ${z} ${bn.name} | ${bo.name==bn.name?"Не уверен в валидности":"Валид"}`);
			});
		}
		
		
		const mp = bot.entity.position;
		mp.x = Math.floor(mp.x);
		mp.y = Math.floor(mp.y);
		mp.z = Math.floor(mp.z);
		
		for(let y = 4; y<=32; y++){
			for(let z = mp.z-r; z<=mp.z+r; z++){
				for(let x = mp.x-r; x<=mp.x+r; x++){
					if(!bot.scriptStorage.dig) return;
					await check(x,y,z);
				}
			}
			//bot.chat(`/msg ${message.author} Layer ${y} done, goint to next layer...`);
		}
		bot.chat(`/msg ${message.author} Task complete!`);
		bot.scriptStorage.dig = false;
	}
}