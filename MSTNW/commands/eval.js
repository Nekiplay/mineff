const fs = require("fs");
const Vec3 = require("vec3");
module.exports = {
	name: "eval",
	description: "Evaluates a given code.",
	aliases: ["e", "ev"],
	run(bot, args, message) {
		const code = args[0].endsWith(".js") ? fs.readFileSync("./scripts/"+args[0]).toString() : args.join(" ");
		try{
			let out = eval(code);
			if (Buffer.isBuffer(out)) out = "Buffer";
			if(out instanceof Promise){
				out.then(x=>{
					console.log(x);
					bot.chat(`/msg ${message.author} ${x}`);
				})
			}else{
				console.log(out);
				bot.chat(`/msg ${message.author} ${out}`);
			}
		}catch(e){
			console.log(e);
			bot.chat(`/msg ${message.author} ${e}`);
		}
	}
}