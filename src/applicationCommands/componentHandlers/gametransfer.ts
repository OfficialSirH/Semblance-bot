import { MessageEmbed } from 'discord.js';
import { gameTransferPages } from '#constants/commands';
import config from '#config';
import type { ComponentHandler } from '#lib/interfaces/Semblance';
const { currentLogo } = config;

export default {
  buttonHandle: async (interaction, { action }) => {
    const message = interaction.message;
    const embed = message.embeds[0] as MessageEmbed;
    let currentPage = gameTransferPages.indexOf(embed.image.url);

    if (action == 'right') currentPage = currentPage == 4 ? 0 : ++currentPage;
    else if (action == 'left') currentPage = currentPage == 0 ? 4 : --currentPage;

    embed
      .setThumbnail(currentLogo.name)
      .setImage(gameTransferPages[currentPage])
      .setDescription(`Step ${currentPage + 1}:`);
    await interaction.update({ embeds: [embed] });
  },
} as ComponentHandler;
