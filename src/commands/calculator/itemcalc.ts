import { bigToName, checkValue, randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { Command } from '@sapphire/framework';
import { itemList } from '#itemList';

export default {
  description: 'calculate prices for items in-game',
  category: 'calculator',
  permissionRequired: 0,
  checkArgs: args => args.length >= 2,
  run: (_client, message, args) => run(message, args),
} as Command<'calculator'>;

const run = async (message: Message, args: string[]) => {
  let itemInput: string, level: number | string, currentLevel: number | string;
  [itemInput, level, currentLevel] = args;
  if (!currentLevel || parseInt(currentLevel) < 0) currentLevel = 0;
  itemInput = itemInput.toLowerCase();
  if (!checkValue(level as string)) return message.reply('Your input for level is invalid');
  if (!checkValue(currentLevel as string)) return message.reply('Your input for current level is invalid');
  level = Number.parseInt(level as string);
  currentLevel = Number.parseInt(currentLevel as string);
  let itemCost: number, itemCostType: string;
  for (const key of Object.keys(itemList))
    if (itemList[key][itemInput]) {
      itemCost = itemList[key][itemInput].price;
      itemCostType = key;
    }
  if (!itemCost) return message.reply("Your input for 'item' was invalid.");
  let resultingPrice = 0;
  for (let i = currentLevel as number; i < (level as number) + (currentLevel as number); i++) {
    resultingPrice += itemCost * Math.pow(1.149999976158142, i);
    if (!isFinite(resultingPrice)) break;
  }
  // Math.floor(Math.log(resultingPrice)) =  itemCost * (level*Math.log(1.15));
  // (Math.floor(Math.log(resultingPrice) / itemCost)) = level*Math.log(1.15);
  // (Math.floor(Math.log(resultingPrice) / itemCost) / Math.log(1.15)) = level;
  const embed = new Embed()
    .setTitle('Item Calculator Results')
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
    .setColor(randomColor)
    .setDescription(
      [
        `Chosen item: ${itemInput}`,
        `Current item level: ${currentLevel}`,
        `Item level goal: ${(level as number) + (currentLevel as number)}`,
        `Resulting Price: ${bigToName(resultingPrice)} ${itemCostType}`,
      ].join('\n'),
    );
  message.reply({ embeds: [embed] });
};
