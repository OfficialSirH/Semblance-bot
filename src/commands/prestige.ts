import { Message, MessageEmbed } from "discord.js";
import { Semblance } from "../structures";
import config from '@semblance/config';
import { randomColor } from '@semblance/constants';
const { currentLogo, prestige, prestigeList, prefix } = config;

module.exports = {
    description: "Get info on the Mesozoic Valley prestige.",
    category: 'game',
    subcategory: 'mesozoic',
    usage: {
        "": ""
    },
    aliases: ['prestigelist'],
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[], identifier: string) => {
    if ((args[0] && args[0].toLowerCase() == 'list') || identifier == 'prestigelist') return sendPrestigeList(message);
    let embed = new MessageEmbed()
        .setTitle("Mesozoic Valley Prestige")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setImage(prestige.name)
        .setThumbnail(currentLogo.name)
        .setDescription("Prestige in the Mesozoic Valley is unlocked at rank 50, which is also the rank that is recommended to purchase the diamond geode. " +
             `Prestige also allows you to keep your Mutagen. Type \`${prefix}prestigelist\` or \`${prefix}prestige list\` for a list of all Prestige!`)
        .setFooter("Footer goes brrr... I don't understand this meme.");
    message.channel.send({ embeds: [embed], files: [currentLogo, prestige] });
}

function sendPrestigeList(message: Message) {
    let embed = new MessageEmbed()
        .setTitle("Mesozoic Valley Prestige List")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setThumbnail(currentLogo.name)
        .setImage(prestigeList.name)
        .setFooter("Thanks to Hardik for this lovely list of Prestige :D");
    message.channel.send({ embeds: [embed], files: [currentLogo, prestigeList] });
}