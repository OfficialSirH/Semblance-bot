import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { MessageEmbed } from 'discord.js';
import config from '#config';

export const build: QueriedInfoBuilder = interaction => {
  const { currentLogo } = config;
  const embed = new MessageEmbed()
    .setTitle('Reptiles and Birds')
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
    .setThumbnail(currentLogo.name)
    .setColor(randomColor)
    .setDescription(
      'The following generators are unlocked by achieving the following ranks in the Mesozoic Valley\n' +
        [
          'Rank 3 - [Turtle](https://cell-to-singularity-evolution.fandom.com/wiki/Turtle)',
          'Rank 6 - [Crocodilia](https://cell-to-singularity-evolution.fandom.com/wiki/Crocodilia)',
          'Rank 10 - [Lizard](https://cell-to-singularity-evolution.fandom.com/wiki/Lizard)',
          'Rank 15 - [Snake](https://cell-to-singularity-evolution.fandom.com/wiki/Snake)',
          'Rank 23 - [Galliformes](https://cell-to-singularity-evolution.fandom.com/wiki/Galliformes)',
          'Rank 28 - [Anseriformes](https://cell-to-singularity-evolution.fandom.com/wiki/Anseriformes)',
          'Rank 33 - [Paleognathae](https://cell-to-singularity-evolution.fandom.com/wiki/Paleognathae)',
          'Rank 38 - [Neoaves](https://cell-to-singularity-evolution.fandom.com/wiki/Neoaves)',
        ]
          .map(t => `**${t}**`)
          .join('\n'),
    );
  return { embeds: [embed], files: [currentLogo] };
};
