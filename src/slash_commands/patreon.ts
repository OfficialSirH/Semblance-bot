import { MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } from 'discord.js';
import {  Semblance } from '../structures';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
const { patreon } = config;

module.exports = {
	permissionRequired: 0,
	run: async (client: Semblance, interaction: CommandInteraction) => {
		/*let embed = new MessageEmbed()
			.setTitle("My Patreon")
			.setURL("https://www.patreon.com/SirHDeveloper")
			.setColor(randomColor)
			.attachFiles([patreon])
			.setThumbnail(patreon.name);
		interaction.send(embed);*/
		// const component = new MessageComponent().addButton({ 
		// 	label: 'Click Here!',
		// 	style: MessageComponent.STYLES.LINK, 
		// 	url: 'https://www.patreon.com/SirHDeveloper',
		// 	emoji: {
		// 		name: 'SirUwU',
		// 		id: '797148051000000512'
		// 	}
		// });
		const component = new MessageActionRow()
		.addComponents(new MessageButton()
			.setStyle('LINK')
			.setLabel('CLICK ME!')
			.setEmoji('<:SirUwU:797148051000000512>')
			.setURL('https://www.patreon.com/SirHDeveloper'));
		return await interaction.reply('Support me on [Patreon](https://www.patreon.com/SirHDeveloper)!', { ephemeral: true, components:[component] });
	}
}