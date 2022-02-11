import { ActionRow, ButtonComponent, Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import type { Command } from '#lib/interfaces/Semblance';

export default {
  description: 'Lists everyone that has helped with the project of Semblance, including myself(SirH).',
  category: 'semblance',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'semblance'>;

const run = async (message: Message) => {
  const embed = new Embed()
    .setTitle('Credits')
    .setColor(randomColor)
    .addFields([
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
    ]);
  const component = new ActionRow().addComponents([
    new ButtonComponent()
      .setCustomId(
        JSON.stringify({
          command: 'credits',
          action: 'thanks',
          id: message.author.id,
        }),
      )
      .setLabel('Special Thanks')
      .setStyle(ButtonStyle.Primary),
    new ButtonComponent()
      .setCustomId(
        JSON.stringify({
          command: 'credits',
          action: 'semblance',
          id: message.author.id,
        }),
      )
      .setLabel('Preview Semblance Art')
      .setStyle(ButtonStyle.Primary),
    new ButtonComponent()
      .setCustomId(
        JSON.stringify({
          command: 'credits',
          action: 'semblancebeta',
          id: message.author.id,
        }),
      )
      .setLabel('Preview Semblance Beta Art')
      .setStyle(ButtonStyle.Primary),
    new ButtonComponent()
      .setCustomId(
        JSON.stringify({
          command: 'credits',
          action: 'semblancerevisioned',
          id: message.author.id,
        }),
      )
      .setLabel('Preview Semblance Revisioned Art')
      .setStyle(ButtonStyle.Primary),
  ]);
  message.channel.send({ embeds: [embed], components: [component] });
};
