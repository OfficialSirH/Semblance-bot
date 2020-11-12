const { MessageEmbed, MessageAttachment, GuildEmoji } = require('discord.js'),
	randomColor = require("../constants/colorRandomizer.js"),
	msToTime = require('../constants/msToTime.js');
let embed = new MessageEmbed();
const botStartTime = Date.now();

module.exports = {
	description: "Check the bot's latency.",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
		let uptime = Date.now() - botStartTime;
		let duration = msToTime(uptime);
		let responseTime = Date.now() - message.createdTimestamp;
	let userAvatar = message.author.avatarURL({ dynamic: true });
		let embed = new MessageEmbed()
		.setTitle("Latency")
		.setColor(randomColor())
		.setThumbnail(userAvatar)
		.setDescription("**Bot Response Time:** `"+responseTime+"ms`\n **API**: `"+Math.round(client.ws.ping)+"ms` \n **Bot Uptime:** `"+duration+"`")
		.setFooter("Why do this to me "+message.author.tag, userAvatar);
		message.channel.send(embed);
	}