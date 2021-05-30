import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants'; 
import { Information } from '@semblance/models';
import { Semblance } from '../structures';

module.exports = {
    description: "Provides the latest changes to Semblance.",
    category: 'semblance',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    let changelogHandler = await Information.findOne({ infoType: "changelog" });
    let embed = new MessageEmbed()
        .setTitle("Changelog")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setDescription(changelogHandler.info);
    message.channel.send(embed);
}
