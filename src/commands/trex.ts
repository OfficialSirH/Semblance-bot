import { MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import type { Command } from '@semblance/lib/interfaces/Semblance';
const { currentLogo, trexBadge } = config;

export default {
    description: "T-Rex info",
    category: 'game',
    subcategory: 'mesozoic',
    permissionRequired: 0,
    checkArgs: () => true,
    run: (_client, message) => {
        let embed = new MessageEmbed()
		.setTitle(`${trexBadge}Tyrannosaurus Rex`)
		.setColor(randomColor)
		.setThumbnail(currentLogo.name)
		.setDescription('The T-Rex, the rightful king of the Mesozoic Valley, can be unlocked at Rank 26 in the Mesozoic Valley, which will also earn you an achievement called, "Birth of a Tyrant".');
	    message.channel.send({ embeds: [embed], files: [currentLogo] });
    }
} as Command<'game'>;