import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor, gameTransferPages } from '#constants/index';
import { Embed, ActionRow, ButtonComponent } from 'discord.js';
import { currentLogo } from '#config';

export const build: QueriedInfoBuilder = interaction => {
  const embed = new Embed()
    .setTitle('Game Transfer')
    .setColor(randomColor)
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
    .setThumbnail(currentLogo.name)
    .setImage(gameTransferPages[0])
    .setDescription('Step 1:');
  const component = new ActionRow().addComponents([
    new ButtonComponent()
      .setCustomId(
        JSON.stringify({
          command: 'gametransfer',
          action: 'left',
          id: interaction.user.id,
        }),
      )
      .setEmoji('⬅️')
      .setStyle(ButtonStyle.Primary),
    new ButtonComponent()
      .setCustomId(
        JSON.stringify({
          command: 'gametransfer',
          action: 'right',
          id: interaction.user.id,
        }),
      )
      .setEmoji('➡️')
      .setStyle(ButtonStyle.Primary),
  ]);
  return {
    embeds: [embed],
    files: [currentLogo],
    components: [component],
  };
};
