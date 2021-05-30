import { gameTransferPages, randomColor } from "../constants";
import config from '@semblance/config';
import { Message, MessageEmbed } from 'discord.js';
import { Semblance } from "../structures";
const { currentLogo } = config;


module.exports = {
	description: "See a step-by-step guide to transfering your game progress into the cloud and onto another device.",
	category: 'game',
	subcategory: 'other',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 0
}

// TODO: Add button support for turning pages

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	let embed = new MessageEmbed()
		.setTitle("Game Transfer")
		.setColor(randomColor)
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.attachFiles([currentLogo])
		.setThumbnail(currentLogo.name)
		.setImage(gameTransferPages[0])
		.setDescription("Step 1:")
		.setFooter(message.author.id);
	message.channel.send(embed)
		.then(async (msg) => {
			await msg.react("⬅️");
			await msg.react("➡️");
		});
}

