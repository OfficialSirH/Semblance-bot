import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { MessageEmbed } from 'discord.js';
import config from '#config';

export const build: QueriedInfoBuilder = interaction => {
  const { currentLogo, terminusChamber } = config;
  const embed = new MessageEmbed()
    .setTitle('Terminus Chamber')
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setImage(terminusChamber.name)
    .setDescription(
      [
        '**Yellow Cube** - ||Explore the Mesozoic Valley||',
        '**Purple Cube** - ||Unlock Singularity for the first time||',
        '**Light Pink Cube** - ||Unlock the human brain||',
        '**Light Blue Cube** - ||Obtain/Evolve Neoaves||',
        '**Blue Cube** - ||Unlock Cetaceans||',
        '**Lime Green Cube** - ||Unlock Crocodilians||',
        '**Orange Cube** - ||Unlock Feliforms||',
        '**Red Cube** - ||Terraform Mars||',
      ].join('\n'),
    );
  return {
    embeds: [embed],
    files: [currentLogo, terminusChamber],
  };
};
