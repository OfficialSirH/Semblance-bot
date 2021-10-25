import { gameTransferPages, randomColor } from '#constants/index';
import config from '#config';
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import type { Message } from 'discord.js';
import type { Command } from '#lib/interfaces/Semblance';
const { currentLogo } = config;

export default {
  description: 'See a step-by-step guide to transfering your game progress into the cloud and onto another device.',
  category: 'game',
  subcategory: 'other',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'game'>;

const run = async (message: Message) => {
  let embed = new MessageEmbed()
    .setTitle('Game Transfer')
    .setColor(randomColor)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setThumbnail(currentLogo.name)
    .setImage(gameTransferPages[0])
    .setDescription('Step 1:');
  const component = new MessageActionRow().addComponents([
    new MessageButton()
      .setCustomId(
        JSON.stringify({
          command: 'gametransfer',
          action: 'left',
          id: message.author.id,
        }),
      )
      .setEmoji('⬅️')
      .setStyle('PRIMARY'),
    new MessageButton()
      .setCustomId(
        JSON.stringify({
          command: 'gametransfer',
          action: 'right',
          id: message.author.id,
        }),
      )
      .setEmoji('➡️')
      .setStyle('PRIMARY'),
  ]);
  message.channel.send({ embeds: [embed], files: [currentLogo], components: [component] });
};
