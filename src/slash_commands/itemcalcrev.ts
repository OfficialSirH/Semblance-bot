import { readFileSync } from 'fs';
import { nameToScNo, bigToName, checkValue } from '@semblance/constants';
import { MessageEmbed, CommandInteraction, User } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Semblance } from '@semblance/structures';
import { ItemList } from '@semblance/lib/interfaces/ItemList';
import { clamp } from '@semblance/lib/utils/math';
const itemList = require('@semblance/itemList') as ItemList;

module.exports = {
    permissionRequired: 0
}

module.exports.run = async (client: Semblance, interaction: CommandInteraction) => {
    const itemInput = interaction.options.getString('item').toLocaleLowerCase(),
    currentLevel = clamp(interaction.options.getInteger('current_level'), 0, Infinity),
    curAmount = interaction.options.getString('currency');

    if (!checkValue(curAmount as string)) return interaction.reply({ content: "Your input for 'currency' is invalid.", ephemeral: true });
    const convertedAmount = nameToScNo(curAmount);
    
    let itemCost: number, itemCostType: string;   
    for (const [key, value] of Object.entries(itemList)) if (itemList[key][itemInput]) {
        itemCost = itemList[key][itemInput].price;
        itemCostType = key;
    }

    if (!itemCost) return interaction.reply({ content: "Your input for 'item' was invalid.", ephemeral: true });
    let num3 = convertedAmount * 0.1499999761581421;
    let num5 = itemCost * Math.pow(1.149999976158142, currentLevel);
    let level = Math.floor(Math.log(num3 / num5 + 1) / Math.log(1.149999976158142));
    let user = interaction.member.user as User,
    embed = new MessageEmbed()
        .setTitle("Item Calculator Results")
        .setAuthor(user.tag, user.displayAvatarURL())
        .setColor(randomColor)
        .setDescription([`Chosen item: ${itemInput}`,
            `Current item level: ${currentLevel}`,
            `currency input: ${bigToName(convertedAmount)} ${itemCostType}`,
            `Resulting level: ${level}`].join('\n'));
    return interaction.reply({ embeds: [embed] });
}