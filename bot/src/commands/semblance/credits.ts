import { Category, randomColor } from '#constants/index';
import { Command } from '#structures/Command';
import { buildCustomId } from '#constants/components';
import { ButtonStyle, type APIChatInputApplicationCommandGuildInteraction } from '@discordjs/core';
import type { FastifyReply } from 'fastify';
import {
  EmbedBuilder,
  ActionRowBuilder,
  type MessageActionRowComponentBuilder,
  ButtonBuilder,
} from '@discordjs/builders';

export default class Credits extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'credits',
      description: 'Lists everyone that has helped with the project of Semblance, including myself(SirH).',
      fullCategory: [Category.semblance],
    });
  }

  public override async chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
    const user = interaction.member.user;

    const embed = new EmbedBuilder()
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

    const component = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(buildCustomId({ command: 'credits', action: 'thanks', id: user.id }))
        .setLabel('Special Thanks')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(buildCustomId({ command: 'credits', action: 'semblance', id: user.id }))
        .setLabel('Preview Semblance Art')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(buildCustomId({ command: 'credits', action: 'semblance-beta', id: user.id }))
        .setLabel('Preview Semblance Beta Art')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(buildCustomId({ command: 'credits', action: 'semblance-revisioned', id: user.id }))
        .setLabel('Preview Semblance Revisioned Art')
        .setStyle(ButtonStyle.Primary),
    );

    await this.client.api.interactions.reply(res, { embeds: [embed.toJSON()], components: [component.toJSON()] });
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
    };
  }
}
