import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Information } from '@semblance/models';
import { Semblance } from '../structures';
import { InformationFormat } from '../models/Information';

module.exports = {
    description: "Used for editing information on the beta and update commands",
    category: 'developer',
    usage: {
        "<beta/update>": "arguments for deciding which information you want to edit"
    },
    permissionRequired: 7,
    checkArgs: (args: string[]) => args.length >= 1
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    if (!args[1] || args[1].length == 0) return message.reply("Why are you trying to put nothing for the information? Come on!");
    let embed = new MessageEmbed()
        .setTitle(`${args[0].charAt(0).toUpperCase() + args[0].slice(1)} Info Changed!`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor);
    let infoHandler: InformationFormat;

    switch (args[0]) {
        case 'beta':
            infoHandler = await Information.findOneAndUpdate({ infoType: "beta" }, { $set: { info: args.slice(1).join(" ") } }, { new: true });
            embed.setDescription(infoHandler.info);
            break;
        case 'update':
            infoHandler = await Information.findOneAndUpdate({ infoType: "update" }, { $set: { info: args.slice(1).join(" ") } }, { new: true });
            embed.setDescription(infoHandler.info);
            break;
        case 'codes':
            if (args[1] == 'expired') infoHandler = await Information.findOneAndUpdate({ infoType: "codes" }, { $set: { expired: args.slice(2).join(" ") } }, { new: true });
            else if (args[1] == 'footer') infoHandler = await Information.findOneAndUpdate({ infoType: 'codes' }, { $set: { footer: args.slice(2).join(" ") } }, { new: true });
            else infoHandler = await Information.findOneAndUpdate({ infoType: "codes" }, { $set: { info: args.slice(1).join(" ") } }, { new: true });
            embed.setDescription(infoHandler.info)
                .addField("Expired Codes", infoHandler.expired)
                .setFooter(infoHandler.footer);
            break;
        case 'changelog':
            infoHandler = await Information.findOneAndUpdate({ infoType: "changelog" }, { $set: { info: args.slice(1).join(" ") } }, { new: true });
            embed.setDescription(infoHandler.info);
            break;
        default:
            return message.channel.send("What are you trying to type? The options are `beta`, `update`, and 'codes'");
    }
    message.channel.send(embed);
}