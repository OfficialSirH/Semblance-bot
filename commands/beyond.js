const { MessageEmbed } = require('discord.js'), randomColor = require('../constants/colorRandomizer.js'),
	{ roadMap, currentLogo } = require('../config.js');

module.exports = {
	description: "Provides info on The Beyond.",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	var embed = new MessageEmbed()
		.setTitle("Beyond")
		.setColor(randomColor())
		.attachFiles([currentLogo, roadMap])
		.setThumbnail("attachment://Current_Logo.png")
		.setImage("attachment://roadMap.png")
		.setDescription("The Beyond hasn't been released yet, but I know when it will be released, which will be- ***ERROR... data corruption, can't compile***");
	message.channel.send(embed);
}