import { Guild, Message, MessageEmbed, Snowflake } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Semblance } from '../structures';

module.exports = {
	description: "Provides info on the current server",
	category: 'server',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[], identifier: string, { permissionLevel }) => {
	let guild: Guild;
	if (args[0] && permissionLevel == 7) {
		let guildId = /\d{17,20}/.exec(args[0]);
		if (!guildId) return message.reply('WRONG! That id is invalid!');
		guild = client.guilds.cache.get(guildId[0] as Snowflake);
	}
	else guild = message.guild;

	let textChannel = 0, voiceChannel = 0, categoryChannel = 0;
	guild.channels.cache.forEach(channel => {
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

	let roleArray: string[] = [];
	let roleCount = 0;
	guild.roles.cache.forEach(role => {
		roleArray.push(role.name);
		roleCount++;
	});
	let roleList = roleArray.join(", ");

	let serverCreated = `${guild.createdAt}`;
	serverCreated = serverCreated.substring(0, 16);
	let canRoleListWork = (roleList.length > 1024) ? "*Too many roles*":roleList;
	let fetchedGuild = await guild.fetch();
	let owner = await guild.members.fetch(guild.ownerID);
	let embed = new MessageEmbed()
		.setAuthor(guild.name, guild.iconURL())
		.setColor(randomColor)
		.addFields([
			{ name: "Owner", value: owner.toString(), inline: true },
			{ name: "Channel Categories", value: categoryChannel.toString(), inline: true },
			{ name: "Text Channels", value: textChannel.toString(), inline: true },
			{ name: "Voice Channels", value: voiceChannel.toString(), inline: true },
			{ name: "Members", value: fetchedGuild.approximateMemberCount.toString(), inline: true },
			{ name: "Roles", value: roleCount.toString(), inline: true },
			{ name: "Role List", value: canRoleListWork, inline: false },
		])
		.setFooter(`ID: ${guild.id} | Server Created: ${serverCreated}`);
	message.channel.send({ embeds: [embed] });
}

