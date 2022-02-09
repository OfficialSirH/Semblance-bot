import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { MessageEmbed } from 'discord.js';
import { currentLogo } from '#config';

export const build: QueriedInfoBuilder = async (interaction, client) => {
  // const infoHandler = await Information.findOne({ infoType: 'joinbeta' });
  const infoHandler = await client.db.information.findUnique({ where: { type: 'joinbeta' } });
  const embed = new MessageEmbed()
    .setTitle('Steps to join beta')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
    .setFooter({ text: `Called by ${interaction.user.tag}` })
    .setDescription(infoHandler.value);
  return { embeds: [embed], files: [currentLogo] };
};
