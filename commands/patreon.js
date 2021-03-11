const { MessageEmbed, MessageAttachment } = require('discord.js'),
	{randomColor} = require('../constants'),
	{ patreon } = require('../config.js');

module.exports = {
	description: "Provides the link to SirH's Patreon page.",
	category: 'semblance',
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
		.setColor(randomColor)
		.attachFiles(patreon)
		.setThumbnail(patreon.name);
	message.channel.send(embed);
}