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
	.setDescription("[Discord.boats](https://discord.boats/bot/668688939888148480)\n"+
					"[Discordbotlist.com](https://discordbotlist.com/bots/semblance)\n"+
					"[Top.gg](https://top.gg/bot/668688939888148480)")
	.setFooter(`Command called by ${message.author.tag}`, message.author.avatarURL());
	message.channel.send(embed);
}