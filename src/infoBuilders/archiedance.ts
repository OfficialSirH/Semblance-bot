import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { archieDance } from '#config';
import { Embed } from 'discord.js';

export const build: QueriedInfoBuilder = interaction => {
  const embed = new Embed()
    .setTitle('Dancing Archie/Jotaru')
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
    .setDescription(
      'Click the link above for the epic 3 minute video with Archie and Jotaru dancing, which I made as suggested by McScrungledorf#6020. ' +
        "Also, above is a short video of Archie's dance animation from the game :P",
    )
    .setURL('https://drive.google.com/file/d/1twLIqvEG-wwZJFmhtSERWBM5KoJ3zmkg/view?usp=sharing');

  return { embeds: [embed], files: [archieDance] };
};
