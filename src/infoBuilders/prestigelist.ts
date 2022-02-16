import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { currentLogo, prestigeList } from '#config';

export const build: QueriedInfoBuilder = interaction => {
  const embed = new Embed()
    .setTitle('Mesozoic Valley Prestige List')
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setImage(prestigeList.name)
    .setFooter({ text: 'Thanks to Hardik for this lovely list of Prestige :D' });
  return { embeds: [embed], files: [currentLogo, prestigeList] };
};
