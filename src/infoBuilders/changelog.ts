import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { MessageEmbed } from 'discord.js';

export const build: QueriedInfoBuilder = async (interaction, client) => {
  // const changelogHandler = await Information.findOne({ infoType: 'changelog' });
  const changelogHandler = await client.db.information.findUnique({ where: { type: 'changelog' } });
  const embed = new MessageEmbed()
    .setTitle('Changelog')
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
    .setColor(randomColor)
    .setDescription(changelogHandler.value);
  return { embeds: [embed] };
};
