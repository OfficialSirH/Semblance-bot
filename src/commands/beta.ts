import { Message, MessageEmbed } from 'discord.js';
import config from '@semblance/config';
import { randomColor } from '@semblance/constants';
import { Information } from '@semblance/models';
import { Semblance } from '../structures';
const { currentLogo } = config;

module.exports = {
	description: "Get info on the latest beta.",
	category: 'game',
	subcategory: 'other',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	let infoHandler = await Information.findOne({ infoType: "beta" });
	let embed = new MessageEmbed()
		.setTitle("Beta")
		.setColor(randomColor)
		.attachFiles([currentLogo])
		.setThumbnail(currentLogo.name)
		.setDescription(infoHandler.info)
		.setFooter("New stuff do be epicc");
	message.channel.send(embed);
}
