import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Semblance } from '../structures';
const { patreon } = config;

module.exports = {
	description: "Provides the link to SirH's Patreon page.",
	category: 'semblance',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	let embed = new MessageEmbed()
		.setTitle("My Patreon")
		.setURL("https://www.patreon.com/SirHDeveloper")
		.setColor(randomColor)
		.setThumbnail(patreon.name)
		.setDescription(['The rewards for becoming a patreon are:',
			'- You get access to Semblance Beta',
			'- You get a hoisted role in my Discord server (SirH\'s Stuff)',
			'- (Soon:tm:) Get a 2x boosted income in Semblance\'s Idle-Game',
			'- Make me very happy'].join('\n'));
	message.channel.send({ embeds: [embed], files: [patreon] });
}