import { bigToName, checkValue, randomColor } from '@semblance/constants';
import { ItemList } from '@semblance/lib/interfaces/ItemList';
import { Message, MessageEmbed } from 'discord.js';
import { Semblance } from '../structures';
const itemList = require('@semblance/itemList') as ItemList;

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
    let itemInput: string, level: number | string, currentLevel: number | string;
    [itemInput, level, currentLevel] = args;
    if (!currentLevel || currentLevel < 0) currentLevel = 0;
    itemInput = itemInput.toLowerCase();
    if (!checkValue(level as string)) return message.reply('Your input for level is invalid');
    if (!checkValue(currentLevel as string)) return message.reply('Your input for current level is invalid');
    level = Number.parseInt(level as string);
    currentLevel = Number.parseInt(currentLevel as string);
    let itemCost: number, itemCostType: string;
    for (const [key, value] of Object.entries(itemList)) if (itemList[key][itemInput]) {
        itemCost = itemList[key][itemInput].price;
        itemCostType = key;
    }
    if (!itemCost) return message.reply("Your input for 'item' was invalid.");
    let resultingPrice = 0;
    for (let i = currentLevel as number; i < ((level as number) + (currentLevel as number)); i++) {
        resultingPrice += itemCost * Math.pow(1.149999976158142, i);
        if (!isFinite(resultingPrice)) break;
    }
    // Math.floor(Math.log(resultingPrice)) =  itemCost * (level*Math.log(1.15));
    // (Math.floor(Math.log(resultingPrice) / itemCost)) = level*Math.log(1.15);
    // (Math.floor(Math.log(resultingPrice) / itemCost) / Math.log(1.15)) = level;
    let embed = new MessageEmbed()
        .setTitle("Item Calculator Results")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setDescription([`Chosen item: ${itemInput}`,
            `Current item level: ${currentLevel}`,
            `Item level goal: ${level as number + (currentLevel as number)}`,
            `Resulting Price: ${bigToName(resultingPrice)} ${itemCostType}`].join('\n'));
    message.reply(embed);
}