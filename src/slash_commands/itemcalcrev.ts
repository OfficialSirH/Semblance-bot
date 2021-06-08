import { readFileSync } from 'fs';
import { nameToScNo, bigToName, checkValue } from '@semblance/constants';
import { MessageEmbed, CommandInteraction } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Semblance } from '@semblance/structures';
import { ItemList } from '@semblance/lib/interfaces/ItemList';
const itemList = require('@semblance/itemList') as ItemList;

module.exports = {
    permissionRequired: 0
}

module.exports.run = async (client: Semblance, interaction: CommandInteraction) => {
    let [itemInput, currentLevel, curAmount] = interaction.options.map(o => o.value);
    
    if (!itemInput) return interaction.reply("You forgot input for 'item'.", { ephemeral: true });
    if (!curAmount) return interaction.reply("You forgot input for 'Currency Amount'.", { ephemeral: true });
    if (!currentLevel || currentLevel < 0) currentLevel = 0;
    itemInput = (itemInput as string).toLowerCase();
    if (!checkValue(curAmount as string)) return interaction.reply("Your input for 'currency' is invalid.", { ephemeral: true });
    curAmount = nameToScNo(curAmount as string);
    
    let itemCost: number, itemCostType: string;   
    for (const [key, value] of Object.entries(itemList)) if (itemList[key][itemInput]) {
        itemCost = itemList[key][itemInput].price;
        itemCostType = key;
    }

    if (!itemCost) return interaction.reply("Your input for 'item' was invalid.", { ephemeral: true });
    let num3 = curAmount as number * 0.1499999761581421;
    let num5 = itemCost * Math.pow(1.149999976158142, currentLevel as number);
    let level = Math.floor(Math.log(num3 / num5 + 1) / Math.log(1.149999976158142));

    let embed = new MessageEmbed()
        .setTitle("Item Calculator Results")
        .setAuthor(interaction.member.user.tag, interaction.member.user.displayAvatarURL())
        .setColor(randomColor)
        .setDescription([`Chosen item: ${itemInput}`,
            `Current item level: ${currentLevel}`,
            `currency input: ${bigToName(curAmount)} ${itemCostType}`,
            `Resulting level: ${level}`].join('\n'));
    return interaction.reply(embed);
}