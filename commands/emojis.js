const { GuildEmoji } = require('discord.js'),
	fs = require('fs');
/*
let mainClient;
let entropy, idea, darwinium, metabit, mutagen, fossil; //currency
	let trexBadge, raptorBadge, iguanBadge, skull; //badges
	let edone, idone, ddone, medone, mudone, fdone, trexdone, raptordone, iguandone, skulldone; //completed emojis
const clientFE = require('../bot.js').client;
*/

module.exports = {
	description: "Setup Semblance's emojis with this.",
	usage: {
		"": ""
	},
	permissionRequired: 6,
	checkArgs: (args) => args.length >= 1,
	entropy: '<:entropy:742748357163745413>',
	idea: '<:idea:775808337303437353>',
	c2s: '<:CellToSing:498910740200161280>',
	darwinium: '<:darwinium:742748359781122169>',
	//metabitOG: '<:metabitOG:724684027419951177>',
	metabit: '<:metabit:789526514524880906>',
	mutagen: '<:mutagen:724684028598419508>',
	fossil: '<:fossil:742748364625543239>',
	trexBadge: '<:trex_badge:789336714409803858>',
	trexSkull: '<:trex_skull:657015647359860767>',
	singularity: '<:singularity:789526513812504617>',
	nanobotUp: '<:NanobotUp:764149893937102858>',
	nanobotDown: '<:NanobotDown:764149995032412180>'
}

module.exports.run = async (client, message, args) => {
	/*if (args[0] == "main")*/ return mainEmojis(client, message);
	//if (args[1] == "bonus") return bonusEmojis(client, message);
}

async function mainEmojis(client, message) {
	fs.readdir('./images/emojis', async (err, files) => {
		let fileNames = [];
		for (let file of files) fileNames.push(file.replace('.png', '').toLowerCase());
		for (let fileName of fileNames) if (!message.guild.emojis.cache.array().includes(fileName))
			await message.guild.emojis.create(`./images/emojis/${files[fileNames.indexOf(fileName)]}`, fileName);

	});
	message.channel.send(`Emoji setup is complete, ${message.author.username}`);
}
		/*message.guild.emojis.cache.forEach(emoji => {
			if (emoji.name == "entropy") {
				entropy = Emoji(emoji.id);
				edone = true;
			}
			if (emoji.name == "idea") {
				idea = Emoji(emoji.id);
				idone = true;
			}
			if (emoji.name == "darwinium") {
				darwinium = Emoji(emoji.id);
				ddone = true;
			}
			if (emoji.name == "metabit") {
				metabit = Emoji(emoji.id);
				medone = true;
			}
			if (emoji.name == "mutagen") {
				mutagen = Emoji(emoji.id);
				mudone = true;
			}
			if (emoji.name == "fossil") {
				fossil = Emoji(emoji.id);
				fdone = true;
			}
			if (emoji.name == "trex_badge") {
				trexBadge = Emoji(emoji.id);
				trexdone = true;
			}
			if (emoji.name == "trex_skull") {
				skull = Emoji(emoji.id);
				skulldone = true;
			}
			if (emoji.name == "singularity") {
				emoji.delete();
				message.guild.emojis.create("./images/Singularity.png", "singularity");
			}
		})
		if (!edone) { //entropy
			Promise.resolve(message.guild.emojis.create("./images/Entropy.png", "entropy"))
				.then(function (pinkEmoji) { entropy = Emoji(pinkEmoji.id) });
		}
		if (!idone) { //idea
			Promise.resolve(message.guild.emojis.create("./images/Idea.png", "idea"))
				.then(function (yellowEmoji) { idea = Emoji(yellowEmoji.id) });
		}
		if (!ddone) { //darwinium
			Promise.resolve(message.guild.emojis.create("./images/Darwinium.png", "darwinium"))
				.then(function (purpleEmoji) { darwinium = Emoji(purpleEmoji.id) });
		}
		if (!medone) { //metabit
			Promise.resolve(message.guild.emojis.create("./images/Metabit.png", "metabit"))
				.then(function (greenEmoji) { metabit = Emoji(greenEmoji.id) });
		}
		if (!mudone) { //mutagen
			Promise.resolve(message.guild.emojis.create("./images/Mutagen.png", "mutagen"))
				.then(function (mutaEmoji) { mutagen = Emoji(mutaEmoji.id) });
		}
		if (!fdone) { //fossil
			Promise.resolve(message.guild.emojis.create("./images/Fossil.png", "fossil"))
				.then(function (fossEmoji) { fossil = Emoji(fossEmoji.id) });
		}
		if (!trexdone) { //trex_badge
			Promise.resolve(message.guild.emojis.create("./images/Trex_Badge.png", "trex_badge"))
				.then(function (trexEmoji) { trexBadge = Emoji(trexEmoji.id) });
		}
		if (!skulldone) { //skull
			Promise.resolve(message.guild.emojis.create("./images/Skull.png", "trex_skull"))
				.then(function (skullEmoji) { skull = Emoji(skullEmoji.id) });
		}

		edone = false;
		idone = false;
		ddone = false;
		medone = false;
		mudone = false;
		fdone = false;
		trexdone = false;
		skulldone = false;
	}

	async function bonusEmojis(client, message) {
		message.guild.emojis.cache.forEach(emoji=>{
			if(emoji.name == "raptor_badge") {
				raptorBadge = Emoji(emoji.id);
				raptordone = true;
			}
			if(emoji.name == "iguan_badge") {
				iguanBadge = Emoji(emoji.id);
				iguandone = true;
			}
		})
		if (!raptordone) { //raptor_badge
			Promise.resolve(message.guild.emojis.create("./images/Raptor_Badge.png", "raptor_badge"))
			.then(function(raptorEmoji) {raptorBadge = Emoji(raptorEmoji)} );
		}
		if (!iguandone) { //iguan_badge
			Promise.resolve(message.guild.emojis.create("./images/Iguan_Badge.png", "iguan_badge"))
			.then(function(iguanEmoji) {iguanBadge = Emoji(iguanEmoji)} );
			raptordone = false;
			iguandone = false;
		}
	}

	async function Emoji(id) {
		try {
			return clientFE.emojis.cache.get(id).toString();
		} catch (e) {}
	} */
