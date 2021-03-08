const { MessageEmbed } = require('discord.js'),
	{randomColor} = require("../constants");

module.exports = {
	description: "Lists websites where you can vote for Semblance.",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let embed = new MessageEmbed()
	.setTitle("Vote")
	.setColor(randomColor)
	.setThumbnail(client.user.displayAvatarURL())
		.setDescription(["**Websites that provide game boost/is interactible if voted on**",
				`[Top.gg](https://top.gg/bot/${client.user.id})\n`,
				"**Extra voting sites/Don't have any type of interactivity yet**",
				`[Discord.boats](https://discord.boats/bot/${client.user.id})`,
				`[Discordbotlist.com](https://discordbotlist.com/bots/semblance)`,
				`[Discord.bots.gg](https://discord.bots.gg/bots/${client.user.id})`,
				`[Botlist.space](https://botlist.space/bot/${client.user.id})`,
			`[Botsfordiscord.com](https://botsfordiscord.com/bot/${client.user.id})`].join('\n')) // Old Semblance ID: 668688939888148480
	.setFooter(`Command called by ${message.author.tag}`, message.author.displayAvatarURL());
	message.channel.send(embed);
}