import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';

export const build: QueriedInfoBuilder = async (interaction, client) => {
  const changelogHandler = await client.db.information.findUnique({ where: { type: 'changelog' } });
  const embed = new Embed()
    .setTitle('Changelog')
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setColor(randomColor)
    .setDescription(changelogHandler.value);
  return { embeds: [embed] };
};
