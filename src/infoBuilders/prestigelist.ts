import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { MessageEmbed } from 'discord.js';
import { currentLogo, prestigeList } from '#config';

export const build: QueriedInfoBuilder = interaction => {
  const embed = new MessageEmbed()
    .setTitle('Mesozoic Valley Prestige List')
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setImage(prestigeList.name)
    .setFooter('Thanks to Hardik for this lovely list of Prestige :D');
  return { embeds: [embed], files: [currentLogo, prestigeList] };
};
