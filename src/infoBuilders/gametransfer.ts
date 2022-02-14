import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor, gameTransferPages } from '#constants/index';
import { Embed, ActionRow, ButtonComponent, ButtonStyle } from 'discord.js';
import { currentLogo } from '#config';

export const build: QueriedInfoBuilder = interaction => {
  const embed = new Embed()
    .setTitle('Game Transfer')
    .setColor(randomColor)
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setThumbnail(currentLogo.name)
    .setImage(gameTransferPages[0])
    .setDescription('Step 1:');
  const component = new ActionRow().addComponents(
    new ButtonComponent()
      .setCustomId(
        JSON.stringify({
          command: 'gametransfer',
          action: 'left',
          id: interaction.user.id,
        }),
      )
      .setEmoji({ name: '⬅️' })
      .setStyle(ButtonStyle.Primary),
    new ButtonComponent()
      .setCustomId(
        JSON.stringify({
          command: 'gametransfer',
          action: 'right',
          id: interaction.user.id,
        }),
      )
      .setEmoji({ name: '➡️' })
      .setStyle(ButtonStyle.Primary),
  );
  return {
    embeds: [embed],
    files: [currentLogo],
    components: [component],
  };
};
