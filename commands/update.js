const { MessageEmbed } = require('discord.js'), {randomColor} = require('../constants'),
 	{ currentLogo } = require('../config.js'), { Information } = require('./edit.js');

module.exports = {
	description: "Get info on the latest update of C2S.",
	category: 'game',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let infoHandler = await Information.findOne({ infoType: "update" });
	let embed = new MessageEmbed()
		.setTitle("Steam and Mobile Updates")
		.setColor(randomColor)
		.attachFiles(currentLogo)
		.setThumbnail(currentLogo.name)
		.setDescription(infoHandler.info);
		message.channel.send(embed);
}
