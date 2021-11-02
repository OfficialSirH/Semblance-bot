import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { MessageEmbed } from 'discord.js';

export const build: QueriedInfoBuilder = () => {
  const embed = new MessageEmbed().setTitle('Secret').setURL('https://rb.gy/enaq3a');
  return { embeds: [embed], ephemeral: true };
};
