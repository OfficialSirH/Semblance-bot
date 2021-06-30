import { Message, MessageEmbed } from 'discord.js'; 
import { randomColor } from '@semblance/constants';
import { Semblance } from '../structures';

module.exports = {
    description: "Secret command about SirH",
    category: 'secret',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    aliases: [],
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    // Will be implementing some secrets here later, not sure what it will be yet
}