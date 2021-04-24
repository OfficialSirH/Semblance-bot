const { MessageEmbed, MessageAttachment } = require('discord.js'),
	{ MessageComponent } = require('../structures'),
	{randomColor} = require('../constants'),
	{ patreon } = require('../config').default;

module.exports = {
	permissionRequired: 0,
	run: async (client, interaction) => {
		// let embed = new MessageEmbed()
		// 	.setTitle("My Patreon")
		// 	.setURL("https://www.patreon.com/SirHDeveloper")
		// 	.setColor(randomColor)
		// 	.attachFiles(patreon)
		// 	.setThumbnail(patreon.name);
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