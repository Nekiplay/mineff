const mineflayer = require("mineflayer");
const mineflayerViewer = require("prismarine-viewer").mineflayer;
const { pathfinder, goals } = require("mineflayer-pathfinder");
const Movements = require("../components/movements.js");
const GoalFollow = goals.GoalFollow;
const GoalBlock = goals.GoalBlock;
const GoalNear = goals.GoalNear;
const Vec3 = require("vec3");
const wait = (time) => new Promise(resolve => setTimeout(resolve, time));
module.exports = {
	name: "move",
	description: "Moves the bot to a given location.",
	aliases: ["m","goto","go","moveto","movet","mt"],
	async run(bot, args, message) {

		if(args[0] == "~" || args[1] == "~" || args[2] == "~"){

			const u = bot.players[message.author];

			if (!u || !u.entity) {
				bot.chat(`/msg ${message.author} You are not in my render distance.`);
				return;
			}

			args[0] = u.entity.position.x;
			args[1] = u.entity.position.y;
			args[2] = u.entity.position.z;

		}

		const x = Number(args[0]);
		const y = Number(args[1]);
		const z = Number(args[2]);
		
		if(!x || !y || !z) return bot.chat(`/msg ${message.author} Invalid coordinates.`);
		const movements = new Movements(bot, global.mcData);
		movements.scafoldingBlocks = [];
		movements.digCost = 3;
		// bot.pathfinder.setMovements(movements);
		// bot.chat(`/msg ${message.author} I am now moving to ${x}, ${y}, ${z}`);
		// bot.mov.time = new Date().getTime();
		// bot.pathfinder.setGoal(new GoalNear(x,y,z,0));

		const moves = bot.pathfinder.getPathTo(movements,new GoalNear(x,y,z,0)).path;
		if(moves.length == 0) return bot.chat(`/msg ${message.author} I can't get to that location.`);
		let curr = moves[0];
		let moveis = false;
		async function tickUp(){
			if(bot.entity.isInWater) bot.setControlState("jump",true);

			if(bot.entity.position.distanceTo(new Vec3(curr.x,curr.y,curr.z)) < 0.5) {
				console.log("Reached moving");
				bot.clearControlStates();
				if(moves.length > 1) {
					moveis = false;
					moves.shift();
					curr = moves[0];
				} else {
					bot.chat(`/msg ${message.author} I have arrived.`);
					bot.removeListener("physicTick",tickUp);
					return;
				}
			} else {
				
				if(moveis) return;

				console.log("Start moving");

				moveis = true;

				const dir = {
					x: Math.abs(curr.x - Math.floor(bot.entity.position.x)),
					y: curr.y - Math.floor(bot.entity.position.y),
					z: Math.abs(curr.z - Math.floor(bot.entity.position.z))
				}
				//bot.entity.position.directionTo(new Vec3(curr.x,curr.y,curr.z));


				console.log("------------------------")
				console.log(curr);
				console.log("------------------------")

				await bot.lookAt(new Vec3(curr.x,curr.y+1.5,curr.z),false);

				if(dir.x > 0 || dir.z > 0) bot.setControlState("forward",true);
				
				if(curr.parkour)  bot.setControlState("jump",true);

				if(dir.y > 0) bot.setControlState("jump",true);

				else bot.setControlState("jump",false);
			}
		}
		bot.on("physicTick", tickUp);
		// for (const move of moves) {
		// 	console.log(move)
		// 	console.log("-------------------");
		// 	console.log(move.x, move.y, move.z);
		// 	console.log(last.x, last.y, last.z);
		// 	console.log(bot.entity.position.x, bot.entity.position.y, bot.entity.position.z);
		// 	console.log("-------------------");
		// 	await bot.lookAt(new Vec3(move.x,move.y+1.5,move.z),false);
		// 	if(move.y>last.y) {bot.setControlState("jump",true);console.log("Jumping");}
		// 	last = move;
		// 	await bot.setControlState("forward",true);
		// 	await wait(275);
		// 	bot.clearControlStates();
		// }
		// console.log("ARRIVED");
	}
}