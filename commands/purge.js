const discord = require('discord.js');

module.exports = {
	description: "Purge a specified number of messages within a channel.",
	category: 'admin',
	usage: {
		"<channel> <number of msgs>": ""
	},
	permissionRequired: 1,
	checkArgs: (args) => args.length >= 2
}

module.exports.run = async (client, message, args, identifier, { permissionLevel }) => {
	if (!args[0]) return message.reply("Please specify the channel (by id or mention) that you want to purge.");
	if (!args[1]) return message.reply("Please specify the number of messages or input 'all' if you'd like to purge all.");
	let channel = /\d{17,20}/.exec(args[0]),
		purgeNum = Number(args[1].replace('-', ''));
	if (!!!channel) return message.reply("The channel you specified is invalid");
	channel = channel[0];
	if (!!!purgeNum) return message.reply("That value for purge amount is invalid");
	purgeNum = purgeNum > 100 ? 100 : purgeNum;

	channel = message.guild.channels.cache.get(channel);
	if (channel == undefined) return message.reply("That channel doesn't exist in this server");

	if (purgeNum != 'all') return channel.bulkDelete(purgeNum).catch(console.error);

	if (permissionLevel < 6) return message.reply("You don't have perms to nuke the channel");
	const filter = (reaction, user) => reaction.emoji.name === '👌' && user.id === message.author.id
	message.reply("Are you sure you want to nuke this channel? react to this message with 👌 to confirm.")
	.then(msg => msg.awaitReactions(filter, { time: 10000 })
		.then(collected => {
			if (collected.size == 1) {
				channel.clone();
				channel.delete()
					.catch(console.error);
			} else {
				message.reply("Command timed out, do the command again if you want to nuke the channel.");
			}
		})
		.catch(console.error))
	.catch(console.error);
}
