const { MessageEmbed } = require('discord.js'), { currentLogo } = require('../config.js').default, {randomColor} = require('../constants'),
	{ Information } = require('./edit.js');

module.exports = {
	description: "Get info on the latest beta.",
	category: 'game',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let infoHandler = await Information.findOne({ infoType: "beta" });
	let embed = new MessageEmbed()
		.setTitle("Beta")
		.setColor(randomColor)
		.attachFiles(currentLogo)
		.setThumbnail(currentLogo.name)
		.setDescription(infoHandler.info)
		.setFooter("New stuff do be epicc");
	message.channel.send(embed);
}
