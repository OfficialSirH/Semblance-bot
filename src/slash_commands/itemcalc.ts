import { readFileSync } from 'fs';
import { bigToName, checkValue } from '@semblance/constants';
import { MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Semblance, Interaction } from '@semblance/structures';
const itemsList = JSON.parse(readFileSync('./constants/itemsList.json', "utf8"));

module.exports = {
    permissionRequired: 0
}

module.exports.run = async (client: Semblance, interaction: Interaction) => {
    let [itemInput, currentLevel, level] = interaction.data.options.map(o => o.value);

    if (!itemInput) return interaction.send("You forgot input for 'item'.", { ephemeral: true });
    if (!level) return interaction.send("You forgot input for 'level'.", { ephemeral: true });
    if (!currentLevel || currentLevel < 0) currentLevel = 0;
    itemInput = (itemInput as string).toLowerCase();
    if (!checkValue(level as string)) return interaction.send("Your input for 'level' was invalid.", { ephemeral: true });
    if (!checkValue(currentLevel as string)) return interaction.send("Your input for 'current level' was invalid.", { ephemeral: true });
    
    let itemCost: number, itemCostType: string;
    for (const [key, value] of Object.entries(itemsList)) if (itemsList[key][itemInput]) {
        itemCost = itemsList[key][itemInput].price;
        itemCostType = key;
    }

    if (!itemCost) return interaction.send("Your input for 'item' was invalid.", { ephemeral: true });
    let resultingPrice = 0;
    
    for (let i = currentLevel as number; i < (level as number + (currentLevel as number)); i++) {
        resultingPrice += itemCost * Math.pow(1.149999976158142, i);
        if (!isFinite(resultingPrice)) break;
    }

    let embed = new MessageEmbed()
        .setTitle("Item Calculator Results")
        .setAuthor(interaction.member.user.tag, interaction.member.user.displayAvatarURL())
        .setColor(randomColor)
        .setDescription([`Chosen item: ${itemInput}`,
            `Current item level: ${currentLevel}`,
            `Item level goal: ${level as number + (currentLevel as number)}`,
            `Resulting Price: ${bigToName(resultingPrice)} ${itemCostType}`].join('\n'));
    return interaction.send(embed);
}