import { randomColor } from '#src/constants';
import { buildCustomId } from '#src/constants/components';
import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { ActionRow, ButtonComponent, ButtonStyle, Embed } from 'discord.js';

export default class Credits extends InfoBuilder {
  public override name = 'credits';

  public override build(builder: InfoBuilder['BuildOption']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new Embed()
      .setTitle('Credits')
      .setColor(randomColor)
      .addFields(
        { name: 'Developer', value: 'SirH' },
        { name: 'Special Thanks and Organizer', value: 'Aditya' },
        {
          name: 'Artist',
          value: [
            '**Semblance:** cabiie',
            "**Semblance Beta:** Lemon ([Lemon's Instagram page](https://www.instagram.com/creations_without_limtation/))",
            '**Semblance Revisioned:** StarLuckArt(preview soon:tm:) ([DeviantArt](https://www.deviantart.com/starluckart) and [Personal Site](https://bubblestheprotogen.wixsite.com/starluckart))',
          ].join('\n'),
        },
        { name: 'Silly dude who makes up funny ideas', value: 'NerdGamer2848' },
        { name: 'Early Testers', value: 'Aditya, Parrot, Diza, 0NrD, and Aure' },
        {
          name: 'Contributors',
          value: [
            '**Mesozoic Valley and Singularity Speedrun Guide:** Jojoseis',
            '**Image for Prestige List:** Hardik Chavada',
            '**Image for Nanobots:** SampeDrako',
            '**Image for Currency:** Off Pringles',
          ].join('\n'),
        },
      );
    const component = new ActionRow().addComponents(
      new ButtonComponent()
        .setCustomId(buildCustomId({ command: 'credits', action: 'thanks', id: user.id }))
        .setLabel('Special Thanks')
        .setStyle(ButtonStyle.Primary),
      new ButtonComponent()
        .setCustomId(buildCustomId({ command: 'credits', action: 'semblance', id: user.id }))
        .setLabel('Preview Semblance Art')
        .setStyle(ButtonStyle.Primary),
      new ButtonComponent()
        .setCustomId(buildCustomId({ command: 'credits', action: 'semblance-beta', id: user.id }))
        .setLabel('Preview Semblance Beta Art')
        .setStyle(ButtonStyle.Primary),
      new ButtonComponent()
        .setCustomId(buildCustomId({ command: 'credits', action: 'semblance-revisioned', id: user.id }))
        .setLabel('Preview Semblance Revisioned Art')
        .setStyle(ButtonStyle.Primary),
    );

    return { embeds: [embed], components: [component] };
  }
}
