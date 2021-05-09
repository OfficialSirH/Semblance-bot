const { MessageEmbed, MessageAttachment } = require('discord.js'),
	{randomColor} = require("../constants");

module.exports = {
	description: "Provide feedback to the developers of C2S with the given email.",
	category: 'game',
	subcategory: 'other',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let feedbackImage = "https://i.imgur.com/lKQh5zW.png";
	let embed = new MessageEmbed()
	.setTitle("Feedback")
	.setColor(randomColor)
	.setDescription("Give feedback for ComputerLunch's game, C2S.")
	.setImage(feedbackImage)
	.setFooter(`Called by ${message.author.tag}`, message.author.displayAvatarURL());
	message.channel.send(embed);
}