import { bigToName, checkValue } from '#constants/index';
import { Embed } from 'discord.js';
import type { User } from 'discord.js';
import { randomColor } from '#constants/index';
import type { SlashCommand } from '#lib/interfaces/Semblance';
import { itemList } from '#itemList';

export default {
  permissionRequired: 0,
  run: async interaction => {
    let itemInput = interaction.options.get('item').value,
      currentLevel = interaction.options.get('current_level').value;
    const levelGains = interaction.options.get('level_gains').value;

    if (!itemInput)
      return interaction.reply({
        content: "You forgot input for 'item'.",
        ephemeral: true,
      });
    if (!levelGains)
      return interaction.reply({
        content: "You forgot input for 'level'.",
        ephemeral: true,
      });
    if (!currentLevel || currentLevel < 0) currentLevel = 0;
    itemInput = (itemInput as string).toLowerCase();
    if (!checkValue(levelGains as string))
      return interaction.reply({
        content: "Your input for 'level' was invalid.",
        ephemeral: true,
      });
    if (!checkValue(currentLevel as string))
      return interaction.reply({
        content: "Your input for 'current level' was invalid.",
        ephemeral: true,
      });

    let itemCost: number, itemCostType: string;
    for (const key of Object.keys(itemList))
      if (itemList[key][itemInput]) {
        itemCost = itemList[key][itemInput].price;
        itemCostType = key;
      }

    if (!itemCost)
      return interaction.reply({
        content: "Your input for 'item' was invalid.",
        ephemeral: true,
      });
    let resultingPrice = 0;

    for (let i = currentLevel as number; i < (levelGains as number) + (currentLevel as number); i++) {
      resultingPrice += itemCost * Math.pow(1.149999976158142, i);
      if (!isFinite(resultingPrice)) break;
    }
    const user = interaction.member.user as User,
      embed = new Embed()
        .setTitle('Item Calculator Results')
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setColor(randomColor)
        .setDescription(
          [
            `Chosen item: ${itemInput}`,
            `Current item level: ${currentLevel}`,
            `Item level goal: ${(levelGains as number) + (currentLevel as number)}`,
            `Resulting Price: ${bigToName(resultingPrice)} ${itemCostType}`,
          ].join('\n'),
        );
    return interaction.reply({ embeds: [embed] });
  },
} as SlashCommand;
