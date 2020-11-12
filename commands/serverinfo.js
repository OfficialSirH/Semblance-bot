const { MessageEmbed, MessageAttachment } = require('discord.js');
const randomColor = require("../constants/colorRandomizer.js");

module.exports = {
	description: "Provides info on the current server",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let guildID = args[0];
	let isGuild = false;
	if (guildID) {
		if (guildID.length == 18) {
			client.guilds.cache.forEach( guild => { 
				if (guildID == guild.id) {
					guildID = guild;
					isGuild = true;
				}
			});
		} else {
			if (parseInt(guildID).length == guildID.length) {
				message.reply("Your input was invalid, don't use your trickery with me!");
				return;
			}
			client.guilds.cache.forEach( guild => { 
				let guildName = guild.name;
				if (guildID == guildName) {
					guildID = guild;
					isGuild = true;
				}
			});
		}
	} else {
		guildID = message.guild;
		isGuild = true;
	}
	if (!isGuild) {
		message.reply("I couldn't find the server you were looking for");
		return;
	}
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
	let currentLogo = new MessageAttachment("./images/Current_Logo.png");
	let serverCreated = `${guildID.createdAt}`;
	serverCreated = serverCreated.substring(0, 16);
	let canRoleListWork = (roleList.length > 1024) ? "*Too many roles*":roleList;
	let embed = new MessageEmbed()
	.setAuthor(guildID.name, guildID.iconURL())
	.setColor(randomColor())
	.addFields(
		{ name: "Owner", value: guildID.owner, inline: true },
		{ name: "Region", value: guildID.region, inline: true },
		{ name: "Channel Categories", value: categoryChannel, inline: true },
		{ name: "Text Channels", value: textChannel, inline: true },
		{ name: "Voice Channels", value: voiceChannel, inline: true },
		{ name: "Members", value: guildID.memberCount, inline: true },
		{ name: "Roles", value: roleCount, inline: true },
		{ name: "Role List", value: canRoleListWork, inline: false },
	)
	.setFooter(`ID: ${guildID.id} | Server Created: ${serverCreated}`);
	message.channel.send(embed);
	/*if (canRoleListWork == "*Read next msg*") {
		let msgCount = Math.ceil(roleList.length/2048);
		for (let i = 1; i <= msgCount; i++) {
			let roleListEmbed = new MessageEmbed()
			.setTitle("Roles")
			.setDescription(roleList.substring(2048*(i-1), 2048*i))
			.setAuthor(guildID.name, guildID.iconURL())
			.setColor(randomColor())
			.setThumbnail(guildID.iconURL());
			message.channel.send(roleListEmbed);
		}
	}*/
	
}

