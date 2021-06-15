import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Semblance } from '../structures';
import config from '@semblance/config';
const { prefix } = config;

module.exports = {
	description: "Lists websites where you can vote for Semblance.",
	category: 'semblance',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	let embed = new MessageEmbed()
	.setTitle("Vote")
	.setColor(randomColor)
	.setThumbnail(client.user.displayAvatarURL())
		.setDescription(["**Votable sites(gives burst of currency for Semblance's idle-game)**",
				`[Top.gg](https://top.gg/bot/${client.user.id})`,
				`[Discordbotlist.com](https://discordbotlist.com/bots/semblance)`,
				`[Botsfordiscord.com](https://botsfordiscord.com/bot/${client.user.id})`,
				`[Botlist.space](https://botlist.space/bot/${client.user.id})`,
				`[Discord.boats](https://discord.boats/bot/${client.user.id})`,
				"**Unvotable sites**",
				`[Discord.bots.gg](https://discord.bots.gg/bots/${client.user.id})`,
			].join('\n')) // Old Semblance ID: 668688939888148480
	.setFooter(`Thanks, ${message.author.tag}, for considering to support my bot through voting, you may also support me with ${prefix}patreon :D`, message.author.displayAvatarURL());
	message.channel.send({ embeds: [embed] });
}