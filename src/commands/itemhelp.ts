import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Semblance } from '../structures';
const { currentLogo, prefix } = config;

module.exports = {
    description: "Get help with the item calculator commands",
    category: 'help',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    let embed = new MessageEmbed()
        .setTitle("Item Calculator Help")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setThumbnail(currentLogo.name)
        .setDescription(`The item calculator's command is done by doing ${prefix}itemcalc <item name> <item level> <current lvl> or ${prefix}itemcalcrev <item name> <currency input> <current lvl>` +
            ", which any name that has more than one word has to include '-', for example: martian-factory.")
        .addFields(
            {
                name: 'itemcalc example',
                value: `${prefix}itemcalc dna 100 58, this example is taking "dna" to get the specific cost for dna, then "100" is used to specify what level you\'re trying to calculate, finally, "58" specifies the current level the item is at.`
            },
            {
                name: 'itemcalcrev example',
                value: `${prefix}itemcalcrev martian-factory 1E48 148, this example uses the martian-factory for calculating the item\'s specific cost, then "1E48" is fossil input for how many fossils you\'re "spending", finally, "148" is your current level of the item you specified.`
            }
        )
        .setFooter("Item Calculator goes brrrr...");
    message.channel.send({ embeds: [embed], files: [currentLogo] });
}