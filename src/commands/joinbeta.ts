import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Information } from '@semblance/models';
import { Semblance } from '../structures';
const { currentLogo } = config;

module.exports = {
    description: "Info on how to become a beta tester",
    category: 'game',
    subcategory: 'other',
    usage: {
        "": ""
    },
    aliases: ['betajoin', 'betaform'],
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    let infoHandler = await Information.findOne({ infoType: 'joinbeta' });
    let embed = new MessageEmbed()
        .setTitle('Steps to join beta')
        .setColor(randomColor)
        .setThumbnail(currentLogo.name)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setFooter(`Called by ${message.author.tag}`)
        .setDescription(infoHandler.info);
    message.channel.send({ embeds: [embed], files: [currentLogo] });
}