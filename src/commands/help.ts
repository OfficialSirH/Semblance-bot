import { Message, MessageEmbed } from 'discord.js'; 
import config from '@semblance/config';
import { randomColor } from '@semblance/constants';
import { Semblance } from '../structures';
const { prefix, currentLogo } = config;

module.exports = {
    description: "Lists *all* available commands.",
	category: 'help',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	const helpCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'help').map(key => `**\`${prefix}${key}\`**`), 
		calculatorCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'calculator').map(key => `**\`${prefix}${key}\`**`),
		c2sServerCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'c2sServer').map(key => `**\`${prefix}${key}\`**`);
	let embed = new MessageEmbed()
		.setTitle("Semblance Command List")
		.setColor(randomColor)
		.setAuthor(message.author.tag, message.author.displayAvatarURL())
		.attachFiles([currentLogo])
		.setThumbnail(currentLogo.name)
		.setDescription(`**-> Help Commands**\n${helpCommands.join(', ')}`)
		.addFields(
			{
				name: '**-> Cell to Singularity Server Commands**',
				value: c2sServerCommands.join(', '),
				inline: true
			},
			{ 
				name: '**-> Calculator Commands**',
				value: calculatorCommands.join(', '),
				inline: true
			},
			{ 
				name: "**-> Slash Commands**",
				value: 
					[
					"Semblance's Slash Commands can be listed by typing `/`, which if none are visible,",
					"that's likely due to Semblance not being authorized on the server and a admin will need to click",
					"[here](https://discord.com/oauth2/authorize?client_id=794033850665533450&permissions=8&scope=bot+applications.commands) to authorize Semblance."
					].join(' ')
			}
		)
		.setFooter("Stay Cellular! If you really like the work I've done to Semblance, then check out 's!patreon' :D");
	message.reply(`Here are some lovely commands for you!`, embed);
}
