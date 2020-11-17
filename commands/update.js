const { MessageEmbed } = require('discord.js'), randomColor = require('../constants/colorRandomizer.js'), { currentLogo } = require('../config.js');

module.exports = {
	description: "Get info on the latest update of C2S.",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let embed = new MessageEmbed()
		.setTitle("Steam and Mobile Updates")
		.setColor(randomColor())
		.attachFiles(currentLogo)
		.setThumbnail("attachment://Current_Logo.png")
		.setDescription(["**7_02:**",

			"\n**HOTFIX 7_01**",
			"- Dinosaur tutorial text fixed in Chinese",
			"- Duck swim pathway fixed in the Land Garden",
			"- Improved tree performance",
			"- Updated and corrected various typos in Chinese, Russian, and Vietnamese\n",

			"Stay cellular, and happy discovering!",
			"~Lunch"].join('\n'));
		message.channel.send(embed);
}
