import { MessageEmbed } from 'discord.js';
import { MessageComponent, Semblance, Interaction } from '../structures';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
const { patreon } = config;

module.exports = {
	permissionRequired: 0,
	run: async (client: Semblance, interaction: Interaction) => {
		/*let embed = new MessageEmbed()
			.setTitle("My Patreon")
			.setURL("https://www.patreon.com/SirHDeveloper")
			.setColor(randomColor)
			.attachFiles([patreon])
			.setThumbnail(patreon.name);
		interaction.send(embed);*/
		const component = new MessageComponent().addButton({ 
			label: 'Click Here!',
			style: MessageComponent.STYLES.LINK, 
			url: 'https://www.patreon.com/SirHDeveloper',
			emoji: {
				name: 'SirUwU',
				id: '797148051000000512'
			}
		});
		return interaction.send('Support me on [Patreon](https://www.patreon.com/SirHDeveloper)!', component);
	}
}