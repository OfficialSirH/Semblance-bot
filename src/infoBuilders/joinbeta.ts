import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { currentLogo } from '#config';

export const build: QueriedInfoBuilder = async (interaction, client) => {
  // const infoHandler = await Information.findOne({ infoType: 'joinbeta' });
  const infoHandler = await client.db.information.findUnique({ where: { type: 'joinbeta' } });
  const embed = new Embed()
    .setTitle('Steps to join beta')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setFooter({ text: `Called by ${interaction.user.tag}` })
    .setDescription(infoHandler.value);
  return { embeds: [embed], files: [currentLogo] };
};
