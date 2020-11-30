const { MessageEmbed } = require('discord.js'), { currentLogo } = require('../config.js'), randomColor = require('../constants/colorRandomizer.js');

module.exports = {
	description: "Get info on the latest beta.",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let embed = new MessageEmbed()
		.setTitle("No Beta")
		.setColor(randomColor())
		.attachFiles(currentLogo)
		.setThumbnail("attachment://Current_Logo.png")
		.setDescription(["Currently no beta"].join('\n'))
		.setFooter("Nope");
	message.channel.send(embed);
}
