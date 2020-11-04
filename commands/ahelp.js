const { MessageEmbed } = require('discord.js'), randomColor = require('../constants/colorRandomizer.js'), { currentLogo, prefix } = require('../config.js');

module.exports = {
	description: "Gives a list of all available admin commands.",
	usage: {
		"": ""
	},
	permissionRequired: 1,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	var embed = new MessageEmbed()
		.setColor(randomColor())
		.setTitle("Admin Commands")
		.attachFiles(currentLogo)
		.setThumbnail("attachment://Current_Logo.png")
		.setDescription("Here's a list of admin commands")
		.addFields(
			{ name: `**\`${prefix}lookup <ids or invite-link>\`**`, value: "Search user, emoji, or channel id, and search server invites.", inline: true},
			{ name: `**\`${prefix}emojis <main/bonus>\`**`, value: "This will replace 'undefined' with emojis within commands that use emojis from the bot.", inline: true },
			{ name: `**\`${prefix}rolereact <emoji> <role> <message>\`**`, value: "Role react creates a message that will allow users to gain a role you specify(either id or mention) by reacting to the message with the specified emoji.", inline: true },
			{ name: `**\`${prefix}say <channelMention> <message>\`**`, value: `Make announcements to *any* channel with Semblance, also, you can embed the message by adding 'embed' to the end of the message.`, inline: true },
			{ name: `**\`${prefix}jump <true/t or false/f>\`**`, value: `Enable or disable a feature that automatically converts message links into quoting embeds, which does not work with links outside of the server you're sending in.`, inline: true },
			{ name: `**\`${prefix}embed help\`**`, value: `Explains the use of the embed creator command, \`${prefix}embed\`.`, inline: true }
		);
	message.channel.send(embed);
}