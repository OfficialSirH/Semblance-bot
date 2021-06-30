import { Message, MessageEmbed } from 'discord.js'; 
import { randomColor, subcategoryList } from '@semblance/constants';
import config from '@semblance/config';
import { Semblance } from '../structures';
const { currentLogo } = config;

module.exports = {
    description: "List of all Cell to Singularity related commands",
    category: 'help',
    usage: {
        '': ''
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    const mainCommands = subcategoryList(client, 'game', 'main');
    const mesozoicCommands = subcategoryList(client, 'game', 'mesozoic');
    const otherCommands = subcategoryList(client, 'game', 'other');
    let embed = new MessageEmbed()
        .setTitle("**-> Cell to Singularity Commands**")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setThumbnail(currentLogo.name)
        .addFields([
            { name: 'Main Simulation', value: mainCommands, inline: true },
            { name: 'Mesozoic Valley', value: mesozoicCommands, inline: true },
            { name: '\u200b', value: '\u200b' },
            { name: 'Other/Extras', value: otherCommands, inline: true }
        ])
        .setFooter("C2S for the win!");
    message.channel.send({ embeds: [embed], files: [currentLogo] });
}