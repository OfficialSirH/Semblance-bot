import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Semblance } from '../structures';
const { currentLogo, prefix } = config;

module.exports = {
    description: "",
    category: 'help',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    let embed = new MessageEmbed()
        .setTitle("Metabit Calculator Help")
        .setColor(randomColor)
        .setThumbnail(currentLogo.name)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription("The Metabit Calculator supports Scientific Notation, which means you can type numbers like 1E25, as well as names for numbers like million all the way to vigintillion;" +
            ` Use ${prefix}largenumbers to get more info on large numbers.`)
        .addFields(
            {
                name: "metacalc",
                value: "This command requires two inputs: first entropy, then ideas, which this command will then add up the two inputs(accumulation) and process the amount of metabits that would produce."
            },
            {
                name: 'metacalcrev',
                value: 'This command does the reverse of "metacalc" and will take in an input of metabits and process the accumulation of entropy&ideas you would need to produce that many metabits.'
            },
            {
                name: 'metacalc example',
                value: `${prefix}metacalc 1E23 1.59E49, this example shows 1E23 entropy and 1.59E49 ideas being used for input.`
            },
            {
                name: 'metacalcrev example',
                value: `${prefix}metacalcrev 1E6, this example is using 1E6 (or 1 million) metabits as input.`
            }
        )
        .setFooter("Metabit Calculator goes brrr.");
    message.channel.send({ embeds: [embed], files: [currentLogo] });
}