const { MessageEmbed } = require('discord.js'),
	{randomColor, msToTime} = require("../constants");

module.exports = {
	description: "Check the bot's latency.",
	category: 'semblance',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
		let uptime = Date.now() - client.readyTimestamp,
			duration = msToTime(uptime),
			responseTime = Date.now() - message.createdTimestamp,
			userAvatar = message.author.displayAvatarURL({ dynamic: true }),
			embed = new MessageEmbed()
			.setTitle("Latency")
			.setColor(randomColor)
			.setThumbnail(userAvatar)
			.setDescription(`**Bot Response Time:** \`${responseTime}ms\`\n **API**: \`${Math.round(client.ws.ping)}ms\` \n **Bot Uptime:** \`${duration}\``)
			.setFooter(`Why do this to me ${message.author.tag}`, userAvatar);
		message.channel.send(embed);
}