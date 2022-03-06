import { Embed } from 'discord.js';
import { gameTransferPages } from '#constants/commands';
import { currentLogo } from '#config';
import type { ComponentHandler } from '#lib/interfaces/Semblance';

export default {
  buttonHandle: async (interaction, { action }) => {
    const message = interaction.message;
    const embed = message.embeds[0] as Embed;
    let currentPage = gameTransferPages.indexOf(embed.image.url);

    if (action == 'right') currentPage = currentPage == 4 ? 0 : ++currentPage;
    else if (action == 'left') currentPage = currentPage == 0 ? 4 : --currentPage;

    let description: string;
    if (currentPage == 3) description = '\nUpload your progress from your current device';
    else if (currentPage == 4)
      description = '\nDownload your progress onto the other device you wish to put your progress on';

    embed
      .setThumbnail(currentLogo.name)
      .setImage(gameTransferPages[currentPage])
      .setDescription(`Step ${currentPage + 1}:${description}`);
    await interaction.update({ embeds: [embed] });
  },
} as ComponentHandler;
