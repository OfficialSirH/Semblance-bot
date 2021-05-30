import { Message, MessageEmbed } from 'discord.js'; 
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Semblance } from '../structures';
import { Subcategory } from '@semblance/lib/interfaces/Semblance';
const { currentLogo, prefix } = config;

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
    const mainCommands = cmdsToList(client, 'main');
    const mesozoicCommands = cmdsToList(client, 'mesozoic');
    const otherCommands = cmdsToList(client, 'other');
    let embed = new MessageEmbed()
        .setTitle("**-> Cell to Singularity Commands**")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .attachFiles([currentLogo])
        .setThumbnail(currentLogo.name)
        .addFields([
            { name: 'Main Simulation', value: mainCommands, inline: true },
            { name: 'Mesozoic Valley', value: mesozoicCommands, inline: true },
            { name: '\u200b', value: '\u200b' },
            { name: 'Other/Extras', value: otherCommands, inline: true }
        ])
        .setFooter("C2S for the win!");
    message.channel.send(embed);
}

function cmdsToList(client: Semblance, subcategory: Subcategory) {
    return Object.keys(client.commands)
        .filter(key => client.commands[key].category == 'game' && client.commands[key].subcategory == subcategory)
        .map(key => `**\`${prefix}${key}\`**`).join(', ');
}