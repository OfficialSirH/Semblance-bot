const { MessageEmbed } = require('discord.js'),
	randomColor = require("../constants/colorRandomizer.js");

module.exports = {
	description: "Lists websites where you can vote for Semblance.",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	var embed = new MessageEmbed()
	.setTitle("Vote")
	.setColor(randomColor())
	.setThumbnail(client.user.avatarURL())
		.setDescription(["**Websites that provide game boost/is interactible if voted on**",
				"[Top.gg](https://top.gg/bot/668688939888148480)\n",
				"**Extra voting sites/Don't have any type of interactivity yet**",
				"[Discord.boats](https://discord.boats/bot/668688939888148480)",
				"[Discordbotlist.com](https://discordbotlist.com/bots/semblance)",
				"[Discord.bots.gg](https://discord.bots.gg/bots/668688939888148480)",
				//"[Bots.ondiscord.xyz](https://bots.ondiscord.xyz/bots/668688939888148480)",
			"[Botsfordiscord.com](https://botsfordiscord.com/bot/668688939888148480)"].join('\n'))
	.setFooter(`Command called by ${message.author.tag}`, message.author.avatarURL());
	message.channel.send(embed);
}