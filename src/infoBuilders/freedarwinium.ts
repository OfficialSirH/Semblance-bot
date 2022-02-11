import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { Embed } from 'discord.js';

export const build: QueriedInfoBuilder = () => {
  const embed = new Embed().setTitle('Secret').setURL('https://rb.gy/enaq3a');
  return { embeds: [embed], ephemeral: true };
};
