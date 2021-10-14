import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import config from '@semblance/config';
import { randomColor } from '@semblance/constants';
import { Information } from '@semblance/models';
import type { Semblance } from '../structures';
import type { Command } from '@semblance/lib/interfaces/Semblance';
const { currentLogo } = config;

export default {
	description: "Get info on the latest beta.",
	category: 'game',
	subcategory: 'other',
	permissionRequired: 0,
	checkArgs: () => true,
	run: (_client, message) => run(message)
} as Command<'game'>;

const run = async (message: Message) => {
	let infoHandler = await Information.findOne({ infoType: "beta" });
	let embed = new MessageEmbed()
		.setTitle("Beta")
		.setColor(randomColor)
		.setThumbnail(currentLogo.name)
		.setDescription(infoHandler.info)
		.setFooter("New stuff do be epicc");
	message.channel.send({ embeds: [embed], files: [currentLogo] });
}
