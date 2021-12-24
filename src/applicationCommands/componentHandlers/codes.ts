import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { currentLogo } from '#config';
import type { ComponentHandler } from '#lib/interfaces/Semblance';

export default {
  buttonHandle: async (interaction, { action, id }, { client }) => {
    const codeHandler = await client.db.information.findUnique({ where: { type: 'codes' } }),
      embed = interaction.message.embeds[0] as MessageEmbed;
    let component: MessageActionRow;
    if (action == 'expired') {
      embed.setDescription(codeHandler.expired);
      component = new MessageActionRow().addComponents([
        new MessageButton()
          .setCustomId(
            JSON.stringify({
              command: 'codes',
              action: 'valid',
              id,
            }),
          )
          .setLabel('View Valid Codes')
          .setStyle('PRIMARY'),
      ]);
    } else if (action == 'valid') {
      embed.setDescription(codeHandler.value);
      component = new MessageActionRow().addComponents([
        new MessageButton()
          .setCustomId(
            JSON.stringify({
              command: 'codes',
              action: 'expired',
              id,
            }),
          )
          .setLabel('View Expired Codes')
          .setStyle('PRIMARY'),
      ]);
    }
    embed.setThumbnail(currentLogo.name);
    await interaction.update({ embeds: [embed], components: [component] });
  },
} as ComponentHandler;
