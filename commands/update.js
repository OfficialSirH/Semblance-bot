const { MessageEmbed } = require('discord.js'), randomColor = require('../constants/colorRandomizer.js'), { currentLogo } = require('../config.js'),
	Information = require('./edit.js').information;

module.exports = {
	description: "Get info on the latest update of C2S.",
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
		.setColor(randomColor())
		.attachFiles(currentLogo)
		.setThumbnail("attachment://Current_Logo.png")
		.setDescription(infoHandler.info);
		message.channel.send(embed);
}
