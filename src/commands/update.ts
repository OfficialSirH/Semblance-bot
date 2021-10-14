import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Information } from '../models';
import type { Command } from '@semblance/lib/interfaces/Semblance';
const { currentLogo } = config; 

export default {
	description: "Get info on the latest update of C2S.",
	category: 'game',
	subcategory: 'other',
	permissionRequired: 0,
	checkArgs: () => true,
	run: (_client, message) => run(message)
} as Command<'game'>;

const run = async (message: Message) => {
	let infoHandler = await Information.findOne({ infoType: "update" });
	let embed = new MessageEmbed()
		.setTitle("Steam and Mobile Updates")
		.setColor(randomColor)
		.setThumbnail(currentLogo.name)
		.setDescription(infoHandler.info);
	message.channel.send({ embeds: [embed], files: [currentLogo] });
}
