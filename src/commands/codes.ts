import { Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Information } from '@semblance/models';
import { Semblance } from '../structures';
const { currentLogo } = config;

module.exports = {
    description: "get all of the ingame codes",
    category: 'game',
    subcategory: 'other',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    const codeHandler = await Information.findOne({ infoType: 'codes' });
    let embed = new MessageEmbed()
        .setTitle("Darwinium Codes")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setThumbnail(currentLogo.name)
        .setDescription(codeHandler.info)
        .setFooter(codeHandler.footer);
    const component = new MessageActionRow()
    .addComponents([new MessageButton()
        .setCustomId(JSON.stringify({
            command: 'codes',
            action: 'expired',
            id: message.author.id
        }))
        .setLabel('View Expired Codes')
        .setStyle('PRIMARY')
    ]);
    message.channel.send({ embeds: [embed], files: [currentLogo], components: [component] });
}
