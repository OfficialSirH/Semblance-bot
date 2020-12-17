const { GuildEmoji } = require('discord.js');
let mainClient;
let entropy, idea, darwinium, metabit, mutagen, fossil; //currency
	let trexBadge, raptorBadge, iguanBadge, skull; //badges
	let edone, idone, ddone, medone, mudone, fdone, trexdone, raptordone, iguandone, skulldone; //completed emojis
const clientFE = require('../bot.js').client;

module.exports = {
	description: "Setup Semblance's emojis with this.",
	usage: {
		"<main/bonus>": ""
	},
	permissionRequired: 6,
	checkArgs: (args) => args.length >= 1,
	entropy: '<:entropy:724190385852776459>',
	idea: '<:idea:724190386523865208>',
	darwinium: '<:darwinium:724190386855346177>',
	metabitOG: '<:metabitOG:724684027419951177>',
	metabit: '<:metabit:789233118639947866>',
	mutagen: '<:mutagen:724684028598419508>',
	fossil: '<:fossil:724684029080633345>',
	trexBadge: '<:trex_badge:724883149259276318>',
	raptorBadge: '<:raptor_badge:724883150135885894>',
	iguanBadge: '<:iguan_badge:724883150504853516>',
	trexSkull: '<:trex_skull:724883151054176258>',
	singularity: '<:singularity:744968520693186610>',
	nanobotUp: '<:NanobotUp:768745551474589697>',
	nanobotDown: '<:NanobotDown:768745589625716777>'
}

module.exports.run = async (client, message, args) => {
	if (args[0] == "main") return mainEmojis(client, message);
	if (args[1] == "bonus") return bonusEmojis(client, message);
}

	async function mainEmojis(client, message) {
		mainClient = client;
					message.guild.emojis.cache.forEach(emoji=>{
						if(emoji.name == "entropy") {
							entropy = Emoji(emoji.id);
							edone = true;
						}
						if(emoji.name == "idea") {
							idea = Emoji(emoji.id);
							idone = true;
						}
						if(emoji.name == "darwinium") {
							darwinium = Emoji(emoji.id);
							ddone = true;
						}
						if(emoji.name == "metabit") {
							metabit = Emoji(emoji.id);
							medone = true;
						}
						if(emoji.name == "mutagen") {
							mutagen = Emoji(emoji.id);
							mudone = true;
						}
						if(emoji.name == "fossil") {
							fossil = Emoji(emoji.id);
							fdone = true;
						}
						if(emoji.name == "trex_badge") {
							trexBadge = Emoji(emoji.id);
							trexdone = true;
						}
						if(emoji.name == "trex_skull") {
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
						.then(function(pinkEmoji) {entropy = Emoji(pinkEmoji.id)} );
					}
					if (!idone) { //idea
						Promise.resolve(message.guild.emojis.create("./images/Idea.png", "idea"))
						.then(function(yellowEmoji) {idea = Emoji(yellowEmoji.id)} );
					}
					if (!ddone) { //darwinium
						Promise.resolve(message.guild.emojis.create("./images/Darwinium.png", "darwinium"))
						.then(function(purpleEmoji) {darwinium = Emoji(purpleEmoji.id)} );
					}
					if (!medone) { //metabit
						Promise.resolve(message.guild.emojis.create("./images/Metabit.png", "metabit"))
						.then(function(greenEmoji) {metabit = Emoji(greenEmoji.id)} );
					}
					if (!mudone) { //mutagen
						Promise.resolve(message.guild.emojis.create("./images/Mutagen.png", "mutagen"))
						.then(function(mutaEmoji) {mutagen = Emoji(mutaEmoji.id)} );
					}
					if (!fdone) { //fossil
						Promise.resolve(message.guild.emojis.create("./images/Fossil.png", "fossil"))
						.then(function(fossEmoji) {fossil = Emoji(fossEmoji.id)} );
					}
					if (!trexdone) { //trex_badge
						Promise.resolve(message.guild.emojis.create("./images/Trex_Badge.png", "trex_badge"))
						.then(function(trexEmoji) {trexBadge = Emoji(trexEmoji.id)} );
					}
					if (!skulldone) { //skull
						Promise.resolve(message.guild.emojis.create("./images/Skull.png", "trex_skull"))
						.then(function(skullEmoji) {skull = Emoji(skullEmoji.id)} );
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
		mainClient = client;
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
	}
