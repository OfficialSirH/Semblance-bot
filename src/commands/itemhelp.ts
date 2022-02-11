import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { prefix, randomColor } from '#constants/index';
import { currentLogo } from '#config';
import type { Command } from '#lib/interfaces/Semblance';
import type { SapphireClient } from '@sapphire/framework';

export default {
  description: 'Get help with the item calculator commands',
  category: 'help',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message) => run(client, message),
} as Command<'help'>;

const run = async (client: SapphireClient, message: Message) => {
  const embed = new Embed()
    .setTitle('Item Calculator Help')
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setDescription(
      `The item calculator's command is done by doing $${prefix}itemcalc <item name> <item level> <current lvl> or $${prefix}itemcalcrev <item name> <currency input> <current lvl>` +
        ", which any name that has more than one word has to include '-', for example: martian-factory.",
    )
    .addFields(
      {
        name: 'itemcalc example',
        value: `$${prefix}itemcalc dna 100 58, this example is taking "dna" to get the specific cost for dna, then "100" is used to specify what level you're trying to calculate, finally, "58" specifies the current level the item is at.`,
      },
      {
        name: 'itemcalcrev example',
        value: `$${prefix}itemcalcrev martian-factory 1E48 148, this example uses the martian-factory for calculating the item's specific cost, then "1E48" is fossil input for how many fossils you're "spending", finally, "148" is your current level of the item you specified.`,
      },
    )
    .setFooter({ text: 'Item Calculator goes brrrr...' });
  message.channel.send({ embeds: [embed], files: [currentLogo] });
};
