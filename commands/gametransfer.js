const { MessageEmbed } = require('discord.js'),
	{ randomColor } = require('@semblance/constants'),
	{ currentLogo } = require('../config.js').default;

const pages = ["https://i.imgur.com/BsjMAu6.png",
		"https://i.imgur.com/QbDAOkF.png",
		"https://i.imgur.com/w1jEuzh.png",
		"https://i.imgur.com/6qTz2Li.png",
		"https://i.imgur.com/YNBHSw9.png"];

module.exports = {
	description: "See a step-by-step guide to transfering your game progress into the cloud and onto another device.",
	category: 'game',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0,
	TurnPage: TurnPage
}

module.exports.run = async (client, message, args) => {
	let embed = new MessageEmbed()
		.setTitle("Game Transfer")
		.setColor(randomColor)
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.attachFiles(currentLogo)
		.setThumbnail(currentLogo.name)
		.setImage(pages[0])
		.setDescription("Step 1:");
	message.channel.send(embed)
		.then(async (msg) => {
			await msg.react("⬅️");
			await msg.react("➡️");
		});
}

async function TurnPage(client, reaction, user) {
	let embed = reaction.message.embeds[0];
	if (reaction.message.embeds.length == 0 || !embed.author || user.tag != embed.author.name || !embed.image || !pages.includes(embed.image.url)) return;

	let currentPage = pages.indexOf(embed.image.url);
	
	if (reaction.emoji.name == "➡️") {
		currentPage = (currentPage == 4) ? 0 : ++currentPage;
		embed = new MessageEmbed()
			.setTitle("Game Transfer")
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor(randomColor)
			.attachFiles(currentLogo)
			.setThumbnail("attachment://Current_Logo.png")
			.setImage(pages[currentPage])
			.setDescription(`Step ${currentPage + 1}:`);
		reaction.message.edit(embed);
		RemoveReaction(reaction, user);

	} else if (reaction.emoji.name == "⬅️") {
		currentPage = (currentPage == 0) ? 4 : --currentPage;
		embed = new MessageEmbed()
			.setTitle("Game Transfer")
			.setAuthor(user.tag, user.displayAvatarURL())
			.setColor(randomColor)
			.attachFiles(currentLogo)
			.setThumbnail("attachment://Current_Logo.png")
			.setImage(pages[currentPage])
			.setDescription(`Step ${currentPage + 1}:`);
		reaction.message.edit(embed);
		RemoveReaction(reaction, user);
	}
}

async function RemoveReaction(reaction, user) {
	try { await reaction.users.remove(user); } catch (error) { console.log("That didn't work D:") }
} 