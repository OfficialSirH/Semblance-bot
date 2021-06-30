import { readFileSync } from 'fs';
import { bigToName, checkValue } from '@semblance/constants';
import { CommandInteraction, MessageEmbed, User } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Semblance } from '@semblance/structures';
import { ItemList } from '@semblance/lib/interfaces/ItemList';
const itemList = require('@semblance/itemList') as ItemList;

module.exports = {
    permissionRequired: 0
}

module.exports.run = async (client: Semblance, interaction: CommandInteraction) => {
    let itemInput = interaction.options.get('item').value,
    currentLevel = interaction.options.get('current_level').value,
    levelGains = interaction.options.get('level_gains').value;

    if (!itemInput) return interaction.reply({ content: "You forgot input for 'item'.", ephemeral: true });
    if (!levelGains) return interaction.reply({ content: "You forgot input for 'level'.", ephemeral: true });
    if (!currentLevel || currentLevel < 0) currentLevel = 0;
    itemInput = (itemInput as string).toLowerCase();
    if (!checkValue(levelGains as string)) return interaction.reply({ content: "Your input for 'level' was invalid.", ephemeral: true });
    if (!checkValue(currentLevel as string)) return interaction.reply({ content: "Your input for 'current level' was invalid.", ephemeral: true });
    
    let itemCost: number, itemCostType: string;
    for (const [key, value] of Object.entries(itemList)) if (itemList[key][itemInput]) {
        itemCost = itemList[key][itemInput].price;
        itemCostType = key;
    }

    if (!itemCost) return interaction.reply({ content: "Your input for 'item' was invalid.", ephemeral: true });
    let resultingPrice = 0;
    
    for (let i = currentLevel as number; i < (levelGains as number + (currentLevel as number)); i++) {
        resultingPrice += itemCost * Math.pow(1.149999976158142, i);
        if (!isFinite(resultingPrice)) break;
    }
    let user = interaction.member.user as User,
    embed = new MessageEmbed()
        .setTitle("Item Calculator Results")
        .setAuthor(user.tag, user.displayAvatarURL())
        .setColor(randomColor)
        .setDescription([`Chosen item: ${itemInput}`,
            `Current item level: ${currentLevel}`,
            `Item level goal: ${levelGains as number + (currentLevel as number)}`,
            `Resulting Price: ${bigToName(resultingPrice)} ${itemCostType}`].join('\n'));
    return interaction.reply({ embeds: [embed] });
}