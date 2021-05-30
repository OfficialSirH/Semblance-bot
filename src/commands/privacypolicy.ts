import { Message, MessageEmbed } from "discord.js";
import { Semblance } from "../structures";
import { randomColor } from '@semblance/constants';

module.exports = {
    description: "Provides link to Semblance's Privacy Policy",
    category: 'semblance',
    usage: {
        "":""
    },
    aliases: ['pp', 'privacy', 'policy'],
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    let embed = new MessageEmbed()
        .setTitle('Privacy Policy')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setURL("https://github.com/OfficialSirH/Semblance-bot/blob/master/Privacy%20Policy.md");
    message.channel.send(embed);
}