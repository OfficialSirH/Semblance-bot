const { MessageEmbed, MessageAttachment } = require('discord.js'),
	randomColor = require('../constants/colorRandomizer.js'),
	{ patreon } = require('../config.js');

module.exports = {
	description: "Provides the link to SirH's Patreon page.",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let embed = new MessageEmbed()
		.setTitle("My Patreon")
		.setURL("https://www.patreon.com/SirHDeveloper")
		.setColor(randomColor())
		.attachFiles(patreon)
		.setThumbnail("attachment://Patreon_Mark_Coral.jpg");
	message.channel.send(embed);
}