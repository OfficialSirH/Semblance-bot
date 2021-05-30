import { readFileSync } from 'fs';
import { nameToScNo, bigToName, checkValue, randomColor } from '@semblance/constants';
import { Message, MessageEmbed } from 'discord.js';
import { Semblance } from '../structures';
const itemsList = JSON.parse(readFileSync('./constants/itemsList.json', "utf8"));

module.exports = {
    description: "",
    category: 'calculator',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 2
}

module.exports.run = async (client: Semblance, message: Message, args: any[]) => {
    let itemInput: string, curAmount: string | number, currentLevel: string | number;
    if (!currentLevel || currentLevel < 0) currentLevel = 0;
    itemInput = itemInput.toLowerCase();
    if (!checkValue(curAmount as string)) return message.reply('Your input for current amount is invalid'); 
    curAmount = nameToScNo(curAmount as string);
    let itemCost: number, itemCostType: string;   
    for (const [key, value] of Object.entries(itemsList)) if (itemsList[key][itemInput]) {
        itemCost = itemsList[key][itemInput].price;
        itemCostType = key;
    }

    if (!itemCost) return message.reply("Your input for 'item' was invalid.");
    let num3 = curAmount as number * 0.1499999761581421;
    let num5 = itemCost * Math.pow(1.149999976158142, currentLevel as number);
    let level = Math.floor(Math.log(num3 / num5 + 1) / Math.log(1.149999976158142));

    let embed = new MessageEmbed()
        .setTitle("Item Calculator Results")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setDescription([`Chosen item: ${itemInput}`,
            `Current item level: ${currentLevel}`,
            `currency input: ${bigToName(curAmount)} ${itemCostType}`,
            `Resulting level: ${level}`].join('\n'));
    message.reply(embed);
}