import { MessageActionRow, MessageButton } from 'discord.js';
import type { SlashCommand } from "@semblance/lib/interfaces/Semblance";

export default {
	permissionRequired: 0,
	run: interaction => {
		const component = new MessageActionRow()
		.addComponents(new MessageButton()
			.setStyle('LINK')
			.setLabel('CLICK ME!')
			.setEmoji('<:SirUwU:797148051000000512>')
			.setURL('https://www.patreon.com/SirHDeveloper'));
		return interaction.reply({ content: 'Support me on [Patreon](https://www.patreon.com/SirHDeveloper)!', ephemeral: true, components:[component] });
	}
} as SlashCommand;