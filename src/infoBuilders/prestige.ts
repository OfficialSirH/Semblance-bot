import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { prestige, currentLogo } from '#config';

export const build: QueriedInfoBuilder = interaction => {
  const embed = new Embed()
    .setTitle('Mesozoic Valley Prestige')
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setColor(randomColor)
    .setImage(prestige.name)
    .setThumbnail(currentLogo.name)
    .setDescription(
      'Prestige in the Mesozoic Valley is unlocked at rank 50, which is also the rank that is recommended to purchase the diamond geode. ' +
        'Prestige also allows you to keep your Mutagen.',
    )
    .setFooter({ text: "Footer goes brrr... I don't understand this meme." });
  return { embeds: [embed], files: [currentLogo, prestige] };
};
