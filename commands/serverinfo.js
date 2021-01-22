const { MessageEmbed, MessageAttachment } = require('discord.js'),
	randomColor = require("../constants/colorRandomizer.js"), { currentLogo } = require('../config.js');

module.exports = {
	description: "Provides info on the current server",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args, identifier, { permissionLevel, content }) => {
	let guildID = args[0];
	let isGuild = false;
	if (guildID && guildID.replace(/\D/, '').length == 18 && permissionLevel == 7)
		guildID = client.guilds.cache.get(guildID);
	else guildID = message.guild;

	let textChannel = 0, voiceChannel = 0, categoryChannel = 0;
	guildID.channels.cache.forEach(channel => {
		if(channel.type == "text") {
			textChannel++;
		}
		if(channel.type == "voice") {
			voiceChannel++;
		}
		if(channel.type == "category") {
			categoryChannel++;
		}
	});

	let roleList = [];
	let roleCount = 0;
	guildID.roles.cache.forEach(role => {
		roleList.push(role.name);
		roleCount++;
	});
	roleList = roleList.join(", ");

	let serverCreated = `${guildID.createdAt}`;
	serverCreated = serverCreated.substring(0, 16);
	let canRoleListWork = (roleList.length > 1024) ? "*Too many roles*":roleList;
	let fetchedGuild = await guildID.fetch();

	let embed = new MessageEmbed()
		.setAuthor(guildID.name, guildID.iconURL())
		.setColor(randomColor())
		.addFields(
			{ name: "Owner", value: guildID.owner, inline: true },
			{ name: "Region", value: guildID.region, inline: true },
			{ name: "Channel Categories", value: categoryChannel, inline: true },
			{ name: "Text Channels", value: textChannel, inline: true },
			{ name: "Voice Channels", value: voiceChannel, inline: true },
			{ name: "Members", value: fetchedGuild.approximateMemberCount, inline: true },
			{ name: "Roles", value: roleCount, inline: true },
			{ name: "Role List", value: canRoleListWork, inline: false },
		)
		.setFooter(`ID: ${guildID.id} | Server Created: ${serverCreated}`);
	message.channel.send(embed);
}

