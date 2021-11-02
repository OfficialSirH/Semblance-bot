import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor, gameTransferPages } from '#constants/index';
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import config from '#config';

export const build: QueriedInfoBuilder = interaction => {
  const { currentLogo } = config;
  const embed = new MessageEmbed()
    .setTitle('Game Transfer')
    .setColor(randomColor)
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
    .setThumbnail(currentLogo.name)
    .setImage(gameTransferPages[0])
    .setDescription('Step 1:');
  const component = new MessageActionRow().addComponents([
    new MessageButton()
      .setCustomId(
        JSON.stringify({
          command: 'gametransfer',
          action: 'left',
          id: interaction.user.id,
        }),
      )
      .setEmoji('⬅️')
      .setStyle('PRIMARY'),
    new MessageButton()
      .setCustomId(
        JSON.stringify({
          command: 'gametransfer',
          action: 'right',
          id: interaction.user.id,
        }),
      )
      .setEmoji('➡️')
      .setStyle('PRIMARY'),
  ]);
  return {
    embeds: [embed],
    files: [currentLogo],
    components: [component],
  };
};
