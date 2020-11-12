const { MessageEmbed, MessageAttachment } = require('discord.js'),
	randomColor = require("../constants/colorRandomizer.js"),
	{ currentLogo } = require('../config.js');
let pageOne = "https://i.imgur.com/BsjMAu6.png",
	pageTwo = "https://i.imgur.com/QbDAOkF.png",
	pageThree = "https://i.imgur.com/w1jEuzh.png",
	pageFour = "https://i.imgur.com/6qTz2Li.png",
	pageFive = "https://i.imgur.com/YNBHSw9.png";

module.exports = {
	description: "See a step-by-step guide to transfering your game progress into the cloud and onto another device.",
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
		.setColor(randomColor())
		.attachFiles(currentLogo)
		.setThumbnail("attachment://Current_Logo.png")
		.setImage(pageOne)
		.setDescription("First step:");
	Promise.resolve(message.channel.send(embed))
		.then(function (msg) {
			msg.react("⬅️");
			msg.react("➡️");
		});
}

async function TurnPage(client, reaction, user) {
	let pages = [pageOne, pageTwo, pageThree, pageFour, pageFive];
	if (reaction.message.embeds.length > 0) {
		let embed = reaction.message.embeds[0];
		if (embed.image && (embed.image.url == pageOne || embed.image.url == pageTwo || embed.image.url == pageThree || embed.image.url == pageFour || embed.image.url == pageFive)) {
			let isPageOne = embed.image.url == pageOne;
			let isPageTwo = embed.image.url == pageTwo;
			let isPageThree = embed.image.url == pageThree;
			let isPageFour = embed.image.url == pageFour;
			let isPageFive = embed.image.url == pageFive;
			if (reaction.emoji.name == "➡️") {
				if (isPageOne) {
					embed = new MessageEmbed()
						.setTitle("Game Transfer")
						.setColor(randomColor())
						.attachFiles(currentLogo)
						.setThumbnail("attachment://Current_Logo.png")
						.setImage(pageTwo)
						.setDescription("Second step:");
					reaction.message.edit(new MessageEmbed(embed));
					RemoveReaction(reaction, user);
				}
				if (isPageTwo) {
					embed = new MessageEmbed()
						.setTitle("Game Transfer")
						.setColor(randomColor())
						.attachFiles(currentLogo)
						.setThumbnail("attachment://Current_Logo.png")
						.setImage(pageThree)
						.setDescription("Third step:");
					reaction.message.edit(new MessageEmbed(embed));
					RemoveReaction(reaction, user);
				}
				if (isPageThree) {
					embed = new MessageEmbed()
						.setTitle("Game Transfer")
						.setColor(randomColor())
						.attachFiles(currentLogo)
						.setThumbnail("attachment://Current_Logo.png")
						.setImage(pageFour)
						.setDescription("Fourth step:");
					reaction.message.edit(new MessageEmbed(embed));
					RemoveReaction(reaction, user);
				}
				if (isPageFour) {
					embed = new MessageEmbed()
						.setTitle("Game Transfer")
						.setColor(randomColor())
						.attachFiles(currentLogo)
						.setThumbnail("attachment://Current_Logo.png")
						.setImage(pageFive)
						.setDescription("Final step:");
					reaction.message.edit(new MessageEmbed(embed));
					RemoveReaction(reaction, user);
				}
				if (isPageFive) {
					RemoveReaction(reaction, user);
				}
			}
			if (reaction.emoji.name == "⬅️") {
				if (isPageOne) {
					RemoveReaction(reaction, user);
				}
				if (isPageTwo) {
					embed = new MessageEmbed()
						.setTitle("Game Transfer")
						.setColor(randomColor())
						.attachFiles(currentLogo)
						.setThumbnail("attachment://Current_Logo.png")
						.setImage(pageOne)
						.setDescription("First step:");
					reaction.message.edit(new MessageEmbed(embed));
					RemoveReaction(reaction, user);
				}
				if (isPageThree) {
					embed = new MessageEmbed()
						.setTitle("Game Transfer")
						.setColor(randomColor())
						.attachFiles(currentLogo)
						.setThumbnail("attachment://Current_Logo.png")
						.setImage(pageTwo)
						.setDescription("Second step:");
					reaction.message.edit(new MessageEmbed(embed));
					RemoveReaction(reaction, user);
				}
				if (isPageFour) {
					embed = new MessageEmbed()
						.setTitle("Game Transfer")
						.setColor(randomColor())
						.attachFiles(currentLogo)
						.setThumbnail("attachment://Current_Logo.png")
						.setImage(pageThree)
						.setDescription("Third step:");
					reaction.message.edit(new MessageEmbed(embed));
					RemoveReaction(reaction, user);
				}
				if (isPageFive) {
					embed = new MessageEmbed()
						.setTitle("Game Transfer")
						.setColor(randomColor())
						.attachFiles(currentLogo)
						.setThumbnail("attachment://Current_Logo.png")
						.setImage(pageFour)
						.setDescription("Fourth step:");
					reaction.message.edit(new MessageEmbed(embed));
					RemoveReaction(reaction, user);
				}
			}
		}
	}
}

async function RemoveReaction(reaction, user) {
	try { await reaction.users.remove(user); } catch (error) { console.log("That didn't work D:") }
} 