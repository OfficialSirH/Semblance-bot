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
	var embed = new MessageEmbed()
		.setTitle("Steam and Mobile Updates")
		.setColor(randomColor())
		.attachFiles(currentLogo)
		.setThumbnail("attachment://Current_Logo.png")
		.setDescription("**Steam & Mobile(6_78):**\n" +
			"- Fixed Time Flux not working in Mesozoic Valley\n"+
			"- Fixed Bug Allowing you to attempt to buy more then 12 Nanobots, but then only taking Metabits. Nanobots capped at 12.\n"+
			"- On first entering the Reality Engine upgrades Flux and Nanobot upgrade unlock after buying the first Speed and Clicking upgrade.\n"+
			"- Grass is green not white in underwater section of Mesozoic Valley\n"+
			"- Discord link updated\n"+
			"- Going underwater in Mesozoic Valley used to cause a null error and messed up the blue water fog and the underwater ambient sounds would not play. This has been fixed.\n\n"+
			"We hope you enjoy these improvements in your Cells universe.\n\n"+
			"Happy exploring!\n"+
			"~Lunch");
		message.channel.send(embed);
}
