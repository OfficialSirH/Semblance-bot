const { MessageEmbed, MessageAttachment } = require('discord.js'),
	{randomColor} = require('../constants'),
	{ patreon } = require('../config').default;

module.exports = {
	permissionRequired: 0,
	run: async (client, interaction) => {
		let embed = new MessageEmbed()
			.setTitle("My Patreon")
			.setURL("https://www.patreon.com/SirHDeveloper")
			.setColor(randomColor)
			.attachFiles(patreon)
			.setThumbnail(patreon.name);

		let UwuRow = '';
		for (let i = 0; i < 9; i++) UwuRow += '<:SirUwU:797148051000000512>\t';
		
		return [{ content: ['Support me on Patreon!', 
		UwuRow,
		'<:SirUwU:797148051000000512> https://www.patreon.com/SirHDeveloper <:SirUwU:797148051000000512>',
		UwuRow].join('\n'), flags: 1 << 6 }];	
		//return [{ embeds: [embed.toJSON()], flags: 1 << 6 }];
	}
}