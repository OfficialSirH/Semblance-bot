const { MessageEmbed, MessageAttachment } = require('discord.js');
const randomColor = require("../constants/colorRandomizer.js");

module.exports = {
	description: "Get info on a specified user or yourself by default.",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	var chosenUser = args[0];
	if (args.length == 0) return guildProfileEmbed(message, message.member);
	chosenUser = chosenUser.replace(/^<@/, "").replace(/!/, "").replace(/>/, "");
	var guildMember = await message.guild.members.fetch(chosenUser)
		.catch(async (err) => {
			var clientUser = await client.users.fetch(chosenUser);
			if (clientUser) return userProfileEmbed(message, clientUser);
			else message.reply("Sorry, that user coulnd't be found in my database.");
		})
	return guildProfileEmbed(message, guildMember);
}

async function guildProfileEmbed(message, member) {
	var accountCreated = `${member.user.createdAt}`;
	accountCreated = `${accountCreated.substring(0, 16)}(${daysAgo(member.user.createdAt)})`;
	var accountJoined = `${member.joinedAt}`;
	accountJoined = `${accountJoined.substring(0, 16)}(${daysAgo(member.joinedAt)})`;
	var embed = new MessageEmbed()
		.setTitle("Guild User Profile")
		.setDescription(`User data for ${member}:`)
		.setColor(randomColor())
		.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
		.addFields(
			{ name: "Username", value: member.user.tag, inline: true },
			{ name: "Discriminator", value: member.user.discriminator, inline: true },
			{ name: "Bot", value: member.user.bot, inline: true },
			{ name: "User ID", value: member.id, inline: true },
			{ name: "Highest Rank", value: member.roles.highest, inline: true },
			{ name: "Created", value: accountCreated, inline: true },
			{ name: "Joined", value: accountJoined, inline: true }
		);
	message.channel.send(embed);
}

async function userProfileEmbed(message, user) {
	var accountCreated = `${message.author.createdAt.toString().substring(0, 16)}(${daysAgo(user.createdTimestamp)})`;
	var embed = new MessageEmbed()
		.setTitle("User Profile")
		.setDescription(`User data for ${user}:`)
		.setColor(randomColor())
		.setThumbnail(user.displayAvatarURL({ dynamic: true }))
		.addFields(
			{ name: "Username", value: user.tag, inline: true },
			{ name: "Discriminator", value: user.discriminator, inline: true },
			{ name: "Bot", value: user.bot, inline: true },
			{ name: "User ID", value: user.id, inline: true },
			{ name: "Created", value: accountCreated, inline: true }
		);
	message.channel.send(embed);
}

function daysAgo(date) {
	var msToDays = 1000 * 60 * 60 * 24;
	return `${Math.round((Date.now() - date) / msToDays)} days ago`;
}