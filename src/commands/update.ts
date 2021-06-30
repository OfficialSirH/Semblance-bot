import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Information } from '../models';
import { Semblance } from '../structures';
const { currentLogo } = config; 

module.exports = {
	description: "Get info on the latest update of C2S.",
	category: 'game',
	subcategory: 'other',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	let infoHandler = await Information.findOne({ infoType: "update" });
	let embed = new MessageEmbed()
		.setTitle("Steam and Mobile Updates")
		.setColor(randomColor)
		.setThumbnail(currentLogo.name)
		.setDescription(infoHandler.info);
	message.channel.send({ embeds: [embed], files: [currentLogo] });
}
