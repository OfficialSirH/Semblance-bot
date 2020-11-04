const { MessageEmbed } = require('discord.js'), { prefix, currentLogo } = require('../config.js'), randomColor = require('../constants/colorRandomizer.js');

module.exports = {
    description: "Lists *all* available commands.",
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	var embed = new MessageEmbed()
		.setColor(randomColor())
		.setTitle("Semblance Command List")
		.attachFiles(currentLogo)
		.setThumbnail("attachment://Current_Logo.png")
		.setDescription(`-Type **\`${prefix}dinos\`**, **\`${prefix}singularity\`**, **\`${prefix}trex\`**, **\`${prefix}geodes\`**, **\`${prefix}music\`**, ` +
		`**\`${prefix}currency\`**, **\`${prefix}beyond\`**, **\`${prefix}sharks\`**, **\`${prefix}simstats\`**, ` +
		`**\`${prefix}gametransfer\`**, **\`${prefix}prestige\`**, **\`${prefix}nanobots\`**, and/or **\`${prefix}reboot\`** for help on each of these topics.`)
		.addFields(
			{
				name: "Other C2S Things", value: `**\`${prefix}feedback\`**\n` +
					`**\`${prefix}largenumbers\`**\n` +
					`**\`${prefix}metahelp\`**\n` +
					`**\`${prefix}itemhelp\`**\n` +
					`**\`${prefix}metaspeedcalc\`**\n` +
					`**\`${prefix}codes\`**\n` +
					`**\`${prefix}roles\`**`, inline: true
			},
			{ name: "Server Admins", value: `**\`${prefix}ahelp\`**`, inline: true },
			{ name: "Latest Update info", value: `**\`${prefix}update\`**\n**\`${prefix}beta\`**`, inline: true },
			{ name: "Miscellaneous Commands", value: `**\`${prefix}mischelp\`**` },
			{ name: "Semblance Information", value: `**\`${prefix}info\`**\n **\`${prefix}changelog\`**\n **\`${prefix}latency\`**\n **\`${prefix}leaderboard\`**\n`+
			 ` **\`${prefix}trello\`**\n **\`${prefix}notify <add/remove>\`**`, inline: true }
		)
		.setFooter("Stay Cellular!");
	message.channel.send(`Here are some lovely commands for you, <@${message.author.id}>`, {embed: embed});
}
