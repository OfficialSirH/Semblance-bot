import { Message, MessageEmbed } from 'discord.js'; 
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Semblance } from '../structures';
const { mementoMori } = config;

module.exports = {
    description: "Memento Mori",
    category: 'secret',
    usage: {
        "": ""
    },
    aliases: ['memento', 'unus', 'unusannus'],
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[], identifier: string) => {
    if (identifier == 'mementomori' || identifier == 'unusannus') return sendIt(message).then(() => setTimeout(() =>{ if(!message.deleted) message.delete() }, 1000));
    if ((identifier == 'memento' && args[0] == 'mori') || (identifier == 'unus' && args[0] == 'mori')) return sendIt(message).then(() => setTimeout(() =>{ if(!message.deleted) message.delete() }, 1000));
}

async function sendIt(message: Message) {
    let embed = new MessageEmbed()
        .setTitle("Memento Mori")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .attachFiles([mementoMori])
        .setImage(mementoMori.name)
        .setDescription(`[The Goodbye](https://www.youtube.com/watch?v=aDQ3nfBbPWM)`);
    message.channel.send(embed);
    setTimeout(() =>{ if(!message.deleted) message.delete() }, 1000);
}