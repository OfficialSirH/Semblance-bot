import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Semblance } from '../structures';
const { currentLogo, sharks } = config;

module.exports = {
	description: "Get info on sharks.",
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
	.setTitle("Sharks")
	.setColor(randomColor)
	.setImage(sharks.name)
	.setThumbnail(currentLogo.name)
	.setDescription("There are six sharks within the game that can be unlocked every 14 days until all of them have been unlocked, which takes 84 days to unlock all of them and by unlocking them all, you'll gain the achievement, \"Shark Week\".\n They're unlocked in this order: \n" +
					"1. Leopard Shark \n 2. Whale Shark \n 3. Tiger Shark \n 4. Great White \n 5. Hammerhead \n 6. **MEGALODON!!**");
	message.channel.send({ embeds: [embed], files: [currentLogo, sharks] });
}