import { gameTransferPages, randomColor } from "../constants";
import config from '@semblance/config';
import { Message, MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
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

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	let embed = new MessageEmbed()
		.setTitle("Game Transfer")
		.setColor(randomColor)
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.attachFiles([currentLogo])
		.setThumbnail(currentLogo.name)
		.setImage(gameTransferPages[0])
		.setDescription("Step 1:");
	const component = new MessageActionRow()
	.addComponents([new MessageButton()
		.setCustomID(JSON.stringify({
			command: 'gametransfer',
			action: 'left',
			id: message.author.id
		}))
		.setEmoji('⬅️')
		.setStyle('PRIMARY'),
		new MessageButton()
		.setCustomID(JSON.stringify({
			command: 'gametransfer',
			action: 'right',
			id: message.author.id
		}))
		.setEmoji('➡️')
		.setStyle('PRIMARY')
	])
	message.channel.send({ embed, components: [component] });
}