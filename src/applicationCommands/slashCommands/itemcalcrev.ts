import { nameToScNo, bigToName, checkValue } from '#constants/index';
import { MessageEmbed } from 'discord.js';
import type { User } from 'discord.js';
import { randomColor } from '#constants/index';
import { clamp } from '#lib/utils/math';
import type { SlashCommand } from '#lib/interfaces/Semblance';
import { itemList } from '#itemList';

export default {
  permissionRequired: 0,
  run: async interaction => {
    const itemInput = interaction.options.getString('item').toLocaleLowerCase(),
      currentLevel = clamp(interaction.options.getInteger('current_level'), 0, Infinity),
      curAmount = interaction.options.getString('currency');

    if (!checkValue(curAmount as string))
      return interaction.reply({
        content: "Your input for 'currency' is invalid.",
        ephemeral: true,
      });
    const convertedAmount = nameToScNo(curAmount);

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
    const num3 = convertedAmount * 0.1499999761581421;
    const num5 = itemCost * Math.pow(1.149999976158142, currentLevel);
    const level = Math.floor(Math.log(num3 / num5 + 1) / Math.log(1.149999976158142));
    const user = interaction.member.user as User,
      embed = new MessageEmbed()
        .setTitle('Item Calculator Results')
        .setAuthor(user.tag, user.displayAvatarURL())
        .setColor(randomColor)
        .setDescription(
          [
            `Chosen item: ${itemInput}`,
            `Current item level: ${currentLevel}`,
            `currency input: ${bigToName(convertedAmount)} ${itemCostType}`,
            `Resulting level: ${level}`,
          ].join('\n'),
        );
    return interaction.reply({ embeds: [embed] });
  },
} as SlashCommand;
