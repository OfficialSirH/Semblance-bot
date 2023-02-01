import { buildCustomId, componentInteractionDefaultParser, filterAction } from '#constants/components';
import type { ParsedCustomIdData } from '#lib/interfaces/Semblance';
import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  type MessageActionRowComponentBuilder,
} from '@discordjs/builders';
import { ButtonStyle } from '@discordjs/core';

export default class Credits extends InteractionHandler {
  public constructor(context: PieceContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      name: 'credits',
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction): ReturnType<typeof componentInteractionDefaultParser> {
    return componentInteractionDefaultParser(this, interaction);
  }

  public override async run(
    interaction: ButtonInteraction,
    data: ParsedCustomIdData<'credits' | 'thanks' | 'semblance' | 'semblance-beta'>,
  ) {
    const embed = new EmbedBuilder();
    const creditComponents = [
      new ButtonBuilder()
        .setCustomId(
          buildCustomId({
            command: this.name,
            action: 'credits',
            id: interaction.user.id,
          }),
        )
        .setLabel('Credits')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(
          buildCustomId({
            command: this.name,
            action: 'thanks',
            id: interaction.user.id,
          }),
        )
        .setLabel('Special Thanks')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(
          buildCustomId({
            command: this.name,
            action: 'semblance',
            id: interaction.user.id,
          }),
        )
        .setLabel('Preview Semblance Art')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(
          buildCustomId({
            command: this.name,
            action: 'semblancebeta',
            id: interaction.user.id,
          }),
        )
        .setLabel('Preview Semblance Beta Art')
        .setStyle(ButtonStyle.Primary),
    ];

    switch (data.action) {
      case 'credits':
        embed.setTitle('Credits').addFields(
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
        );
        break;
      case 'thanks':
        embed
          .setTitle('Special Thanks')
          .setDescription(
            'Special Thanks to Aditya for motivating me from the very beginning to work on this bot. ' +
              "If it weren't for him, my bot wouldn't even be at this point right now; running on an actual server, " +
              'built with a better Discord module than previously, and have this many features. He even convinced Hype ' +
              "to add my bot to Cell to Singularity, which I can't thank him enough for, cause I was too shy to ask Hype. " +
              "Thanks again, Aditya, you've helped me a lot. :D",
          );
        break;
      case 'semblance':
        embed.setTitle('Semblance - by cabiie').setImage(this.client.user.displayAvatarURL() + '?size=2048');
        break;
      case 'semblance-beta':
        embed
          .setTitle('Semblance Beta - by Lemon')
          .setImage(
            'https://cdn.discordapp.com/avatars/794049840651960350/b101b9f78fb44d2c0b0c40e53b17e677.png?size=2048',
          );
        break;
      default:
        return;
    }

    const components = filterAction(
      [new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(...creditComponents)],
      data.action,
    );
    await interaction.update({ embeds: [embed.toJSON()], components });
  }
}
