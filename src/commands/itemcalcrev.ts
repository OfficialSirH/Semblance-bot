import { nameToScNo, bigToName, checkValue, randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import type { Command } from '#lib/interfaces/Semblance';
import { itemList } from '#itemList';

export default {
  description: 'calculate the price for a specific level of an item',
  category: 'calculator',
  permissionRequired: 0,
  checkArgs: args => args.length >= 2,
  run: (_client, message, args) => run(message, args),
} as Command<'calculator'>;

const run = async (message: Message, args: string[]) => {
  let itemInput: string, curAmount: string | number, currentLevel: string | number;
  [itemInput, curAmount, currentLevel] = args;
  if (!currentLevel || parseInt(currentLevel) < 0) currentLevel = 0;
  itemInput = itemInput.toLowerCase();
  if (!checkValue(curAmount as string)) return message.reply('Your input for current amount is invalid');
  curAmount = nameToScNo(curAmount as string);
  let itemCost: number, itemCostType: string;
  for (const key of Object.keys(itemList))
    if (itemList[key][itemInput]) {
      itemCost = itemList[key][itemInput].price;
      itemCostType = key;
    }

  if (!itemCost) return message.reply("Your input for 'item' was invalid.");
  const num3 = (curAmount as number) * 0.1499999761581421;
  const num5 = itemCost * Math.pow(1.149999976158142, currentLevel as number);
  const level = Math.floor(Math.log(num3 / num5 + 1) / Math.log(1.149999976158142));

  const embed = new Embed()
    .setTitle('Item Calculator Results')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(randomColor)
    .setDescription(
      [
        `Chosen item: ${itemInput}`,
        `Current item level: ${currentLevel}`,
        `currency input: ${bigToName(curAmount)} ${itemCostType}`,
        `Resulting level: ${level}`,
      ].join('\n'),
    );
  message.reply({ embeds: [embed] });
};
