import { CommandInteraction, MessageActionRow, MessageButton } from 'discord.js';
import {  Semblance } from '../structures';

module.exports = {
	permissionRequired: 0,
	run: async (client: Semblance, interaction: CommandInteraction) => {
		const component = new MessageActionRow()
		.addComponents(new MessageButton()
			.setStyle('LINK')
			.setLabel('CLICK ME!')
			.setEmoji('<:SirUwU:797148051000000512>')
			.setURL('https://www.patreon.com/SirHDeveloper'));
		return await interaction.reply({ content: 'Support me on [Patreon](https://www.patreon.com/SirHDeveloper)!', ephemeral: true, components:[component] });
	}
}