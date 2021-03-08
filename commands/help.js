const { MessageEmbed } = require('discord.js'), { prefix, currentLogo } = require('../config.js'), {randomColor} = require('../constants');

module.exports = {
    description: "Lists *all* available commands.",
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let embed = new MessageEmbed()
		.setColor(randomColor)
		.setTitle("Semblance Command List")
		.attachFiles(currentLogo)
		.setThumbnail(currentLogo.name)
		.setDescription(`-Type **\`${prefix}dinos\`**, **\`${prefix}singularity\`**, **\`${prefix}trex\`**, **\`${prefix}geodes\`**, **\`${prefix}music\`**, ` +
		`**\`${prefix}currency\`**, **\`${prefix}metabits\`**, **\`${prefix}beyond\`**, **\`${prefix}sharks\`**, **\`${prefix}simstats\`**, ` +
		`**\`${prefix}gametransfer\`**, **\`${prefix}prestige\`**, **\`${prefix}nanobots\`**, and/or **\`${prefix}reboot\`** for help on each of these topics.`)
		.addFields(
			{
				name: "Other C2S Things", value: [ `**\`${prefix}report help\`**`,
					`**\`${prefix}feedback\`**`,
					`**\`${prefix}largenumbers\`**`,
					`**\`${prefix}metahelp\`**`,
					`**\`${prefix}itemhelp\`**`,
					`**\`${prefix}metaspeedcalc\`**`,
					`**\`${prefix}codes\`**`,
					`**\`${prefix}roles\`**`].join('\n'), inline: true
			},
			{ name: "Server Admins", value: `**\`${prefix}ahelp\`**`, inline: true },
			{ name: "Latest C2S Update info", value: `**\`${prefix}update\`**\n**\`${prefix}beta\`**\n**\`${prefix}joinbeta\`**`, inline: true },
			{ name: "Miscellaneous Commands", value: `**\`${prefix}mischelp\`**`, inline: true },
			{ name: "Slash Commands", value: ["Semblance's Slash Commands can be listed by typing `/`, which if none are visible,",
											"that's likely due to Semblance not being authorized on the server and a admin will need to click",
											 "[here](https://discord.com/oauth2/authorize?client_id=794033850665533450&permissions=8&scope=bot+applications.commands) to authorize Semblance."].join(' ') },
			{
				name: "Semblance Information", value: [`**\`${prefix}info\`**`, 
					`**\`${prefix}changelog\`**`,
					`**\`${prefix}privacypolicy\`**`,
					`**\`${prefix}latency\`**`,
					`**\`${prefix}leaderboard\`**`,
					`**\`${prefix}trello\`**`,
					`**\`${prefix}notify <add/remove>\`**`].join('\n'), inline: true
			}
		)
		.setFooter("Stay Cellular!");
	message.channel.send(`Here are some lovely commands for you, <@${message.author.id}>`, {embed: embed});
}
