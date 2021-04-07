const { MessageEmbed, MessageAttachment } = require('discord.js');
const {randomColor} = require("../constants");

module.exports = {
	description: "Get info on a specified user or yourself by default.",
	category: 'utility',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	let chosenUser = args[0];
	if (args.length == 0) return guildProfileEmbed(message, message.member);
	const userReg = /\d{17,19}/;
	if (!userReg.exec(chosenUser)) return message.reply("You've provided invalid input");
	else chosenUser = userReg.exec(chosenUser)[0];
	let guildMember;
	try {
		guildMember = await message.guild.members.fetch(chosenUser, { cache: false });
	} catch (e) {
		guildMember = false;
    }
	if (guildMember) return guildProfileEmbed(message, guildMember);

	try {
		let user = await client.users.fetch(chosenUser, { cache: false });
		if (user) return userProfileEmbed(message, user);
		else message.reply("Sorry, that user couldn't be found in Discord at all");
	} catch (e) {
		
    }
}

async function guildProfileEmbed(message, member) {
	let accountCreated = `${member.user.createdAt}`;
	accountCreated = `${accountCreated.substring(0, 16)}(${daysAgo(member.user.createdAt)})`;
	let accountJoined = `${member.joinedAt}`;
	accountJoined = `${accountJoined.substring(0, 16)}(${daysAgo(member.joinedAt)})`;
	let embed = new MessageEmbed()
		.setTitle("Guild User Profile")
		.setDescription(`User data for ${member}:`)
		.setColor(randomColor)
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
	let accountCreated = `${message.author.createdAt.toString().substring(0, 16)}(${daysAgo(user.createdTimestamp)})`;
	let embed = new MessageEmbed()
		.setTitle("User Profile")
		.setDescription(`User data for ${user}:`)
		.setColor(randomColor)
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
	let msToDays = 1000 * 60 * 60 * 24;
	return `${Math.round((Date.now() - date) / msToDays)} days ago`;
}