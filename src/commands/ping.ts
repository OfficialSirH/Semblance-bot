import { Message } from 'discord.js';
import { Semblance } from '../structures';

module.exports = {
	description: "Pings a user",
	category: 'semblance',
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = (client: Semblance, message: Message, args: string[]) => {
    message.channel.send(`Pinging me gets you pinged, <@${message.author.id}> :D`);
};