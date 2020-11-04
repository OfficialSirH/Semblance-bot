const { MessageEmbed } = require('discord.js');
const randomColor = require("../constants/colorRandomizer.js");

module.exports = {
	description: "Provides the number of members in the server.",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	var embed = new MessageEmbed()
	.setTitle("Members")
	.setColor(randomColor())
	.setDescription(message.guild.memberCount)
	.setFooter(`Called upon by ${message.author.tag}`);
	message.channel.send(embed);
}