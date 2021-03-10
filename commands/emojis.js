const { MessageEmbed } = require('discord.js'),
	fs = require('fs');

module.exports = {
	description: "Setup Semblance's emojis with this.",
	category: 'admin',
	usage: {
		"": ""
	},
	permissionRequired: 6,
	checkArgs: (args) => args.length >= 0,
}

module.exports.run = async (client, message, args) => {
	return mainEmojis(client, message);
}

async function mainEmojis(client, message) {
	fs.readdir('./images/emojis/', async (err, files) => {
		let fileNames = [];
		for (let file of files) fileNames.push(file.replace('.png', '').toLowerCase());
		for (let fileName of fileNames) if (!message.guild.emojis.cache.array().includes(fileName)) {
			await message.guild.emojis.create(`./images/emojis/${files[fileNames.indexOf(fileName)]}`, fileName);
		}

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
