import { Message, Snowflake, TextChannel } from "discord.js";
import { Semblance } from "../structures";

module.exports = {
	description: "Purge a specified number of messages within a channel.",
	category: 'admin',
	usage: {
		"<channel> <number of msgs>": ""
	},
	permissionRequired: 1,
	checkArgs: (args: string[]) => args.length >= 2
}

module.exports.run = async (client: Semblance, message: Message, args: string[], identifier: string, { permissionLevel }) => {
	let channelRegex = /\d{17,20}/.exec(args[0]), channelId: Snowflake,
		purgeNum: number = Number.parseInt(args[1]);
	if (!channelRegex) return message.reply("The channel you specified is invalid");
	channelId = channelRegex[0] as Snowflake;
	if (!purgeNum) return message.reply("That value for purge amount is invalid");
	purgeNum = purgeNum > 100 ? 100 : purgeNum;
	let channel = message.guild.channels.cache.get(channelId) as TextChannel;
	if (!channel) return message.reply("That channel doesn't exist in this server");

	channel.bulkDelete(purgeNum).catch(console.error);

	/*if (permissionLevel < 6) return message.reply("You don't have perms to nuke the channel");
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
	.catch(console.error);*/
}
