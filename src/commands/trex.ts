import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Semblance } from '../structures';
const { currentLogo, trexBadge } = config;

module.exports = {
    description: "T-Rex info",
    category: 'game',
    subcategory: 'mesozoic',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	let embed = new MessageEmbed()
		.setTitle(`${trexBadge}Tyrannosaurus Rex`)
		.setColor(randomColor)
		.attachFiles([currentLogo])
		.setThumbnail(currentLogo.name)
		.setDescription('The T-Rex, the rightful king of the Mesozoic Valley, can be unlocked at Rank 26 in the Mesozoic Valley, which will also earn you an achievement called, "Birth of a Tyrant".');
	message.channel.send(embed);
}