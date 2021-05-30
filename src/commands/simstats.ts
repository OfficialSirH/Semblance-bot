import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Semblance } from '../structures';
const { currentLogo, simStatsLocation } = config;

module.exports = {
    description: "",
	category: 'game',
	subcategory: 'main',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	let embed = new MessageEmbed()
		.setTitle("Simulation Statistics")
		.attachFiles([currentLogo, simStatsLocation])
		.setThumbnail(currentLogo.name)
		.setColor(randomColor)
		.setImage(simStatsLocation.name)
		.setDescription(`Clicking your currency(Image 1) will open the Semblance/Reality Engine, which looking towards the left side of the engine will have a sliding button(Image 2) that will show your game stats.`);
	message.channel.send(embed);
}
