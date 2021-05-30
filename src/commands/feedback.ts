import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Semblance } from '../structures';

module.exports = {
	description: "Provide feedback to the developers of C2S with the given email.",
	category: 'game',
	subcategory: 'other',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	let feedbackImage = "https://i.imgur.com/lKQh5zW.png";
	let embed = new MessageEmbed()
		.setTitle("Feedback")
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.setColor(randomColor)
		.setDescription("Give feedback for ComputerLunch's game, C2S.")
		.setImage(feedbackImage);
	message.channel.send(embed);
}