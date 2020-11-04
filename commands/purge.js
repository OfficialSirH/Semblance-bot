const discord = require('discord.js');

module.exports = {
	description: "Purge a specified number of messages within a channel.",
	usage: {
		"<channel> <number of msgs>": ""
	},
	permissionRequired: 1,
	checkArgs: (args) => args.length >= 2
}

module.exports.run = async (client, message, args) => {
	var channel = args[0];
	var purgeNum = args[1];
	if (!message.member.hasPermission("MANAGE_MESSAGES") && !message.member.hasPermission("MANAGE_CHANNELS")) {
		message.reply("You lack the permission to use this command. You must be able to manage messages or channels.");
		return;
    }
	if (!channel) {
		return message.reply("Please specify the channel (by id) that you want to purge.");
	} else if (!purgeNum) {
		return message.reply("Please specify the number of messages or input 'all' if you'd like to purge all.");
	}
	console.log(channel);
	console.log(client.channels.cache.get(channel));
	channel = IdToChannel(message, channel);
	if (channel == undefined) return message.reply("That channel doesn't exist in this server");
	if (purgeNum == "all") {
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
	} else if (parseInt(purgeNum)+1 > 100) {
		return message.reply("Too many messages to delete, please choose a number under 100");
	} else {
		channel.bulkDelete(parseInt(purgeNum)+1)
			.catch(console.error);
    }
}

function IdToChannel(message, channel) {
    channel = message.guild.channels.cache.get(channel);
    return channel;
}
