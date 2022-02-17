import { gameTransferPages, randomColor } from '#constants/index';
import { currentLogo } from '#config';
import { Embed, ActionRow, ButtonComponent, ButtonStyle } from 'discord.js';
import type { Message } from 'discord.js';
import { Command } from '@sapphire/framework';

export default {
  description: 'See a step-by-step guide to transfering your game progress into the cloud and onto another device.',
  category: 'game',
  subcategory: 'other',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'game'>;

const run = async (message: Message) => {
  const embed = new Embed()
    .setTitle('Game Transfer')
    .setColor(randomColor)
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
    .setThumbnail(currentLogo.name)
    .setImage(gameTransferPages[0])
    .setDescription('Step 1:');
  const component = new ActionRow().addComponents(
    new ButtonComponent()
      .setCustomId(
        JSON.stringify({
          command: 'gametransfer',
          action: 'left',
          id: message.author.id,
        }),
      )
      .setEmoji({ name: '⬅️' })
      .setStyle(ButtonStyle.Primary),
    new ButtonComponent()
      .setCustomId(
        JSON.stringify({
          command: 'gametransfer',
          action: 'right',
          id: message.author.id,
        }),
      )
      .setEmoji({ name: '➡️' })
      .setStyle(ButtonStyle.Primary),
  );
  message.channel.send({
    embeds: [embed],
    files: [currentLogo],
    components: [component],
  });
};
