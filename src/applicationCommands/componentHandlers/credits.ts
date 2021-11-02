import type { ComponentHandler } from '#lib/interfaces/Semblance';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

export default {
  buttonHandle: async (interaction, { action, id }) => {
    const embed = new MessageEmbed();
    const creditComponents = [
      new MessageButton()
        .setCustomId(
          JSON.stringify({
            command: 'credits',
            action: 'credits',
            id,
          }),
        )
        .setLabel('Credits')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(
          JSON.stringify({
            command: 'credits',
            action: 'thanks',
            id,
          }),
        )
        .setLabel('Special Thanks')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(
          JSON.stringify({
            command: 'credits',
            action: 'semblance',
            id,
          }),
        )
        .setLabel('Preview Semblance Art')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(
          JSON.stringify({
            command: 'credits',
            action: 'semblancebeta',
            id,
          }),
        )
        .setLabel('Preview Semblance Beta Art')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId(
          JSON.stringify({
            command: 'credits',
            action: 'semblancerevisioned',
            id,
          }),
        )
        .setLabel('Preview Semblance Revisioned Art')
        .setStyle('PRIMARY'),
    ];
    //return console.log(interaction.message.components);

    if (action == 'credits') {
      embed.setTitle('Credits').addFields([
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
            '**Mesozoic Valley Guide:** Jojoseis',
            '**Image for Prestige List:** Hardik Chavada',
            '**Image for Nanobots:** SampeDrako',
            '**Image for Currency:** Off Pringles',
          ].join('\n'),
        },
      ]);
    } else if (action == 'thanks')
      embed
        .setTitle('Special Thanks')
        .setDescription(
          'Special Thanks to Aditya for motivating me from the very beginning to work on this bot. ' +
            "If it weren't for him, my bot wouldn't even be at this point right now; running on an actual server, " +
            'built with a better Discord module than previously, and have this many features. He even convinced Hype ' +
            "to add my bot to Cell to Singularity, which I can't thank him enough for, cause I was too shy to ask Hype. " +
            "Thanks again, Aditya, you've helped me a lot. :D",
        );
    else if (action == 'semblance')
      embed.setTitle('Semblance - by cabiie').setImage(interaction.client.user.displayAvatarURL() + '?size=2048');
    else if (action == 'semblancebeta')
      embed
        .setTitle('Semblance Beta - by Lemon')
        .setImage(
          'https://cdn.discordapp.com/avatars/794049840651960350/b101b9f78fb44d2c0b0c40e53b17e677.png?size=2048',
        );
    else if (action == 'semblancerevisioned')
      embed.setTitle('Semblance Revisioned - by StarLuckArt(WIP/Not previewable yet)');
    const component = new MessageActionRow().addComponents(
      creditComponents.filter(c => eval(`(${c.customId})`).action != action),
    );
    interaction.update({ embeds: [embed], components: [component] });
  },
} as ComponentHandler;
