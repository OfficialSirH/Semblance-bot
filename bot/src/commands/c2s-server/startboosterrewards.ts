import { Category, GuildId } from '#constants/index';
import { boosterRoleId, createBoosterRewards } from '#constants/models';
import { Command } from '#structures/Command';
import { type APIApplicationCommandInteraction, MessageFlags } from '@discordjs/core';
import type { FastifyReply } from 'fastify';

export default class StartBoosterRewards extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'startboosterrewards',
      description: 'Start retrieving booster rewards after you boost the server.',
      category: [Category.c2sServer],
    });
  }

  public override async chatInputRun(res: FastifyReply, interaction: APIApplicationCommandInteraction) {
    if (!interaction.member?.roles.includes(boosterRoleId))
      return this.client.api.interactions.reply(res, {
        content: 'You need to have the booster role to use this command.',
        flags: MessageFlags.Ephemeral,
      });

    return this.client.api.interactions.reply(
      res,
      await createBoosterRewards(this.client, interaction.user?.id as string),
    );
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
      guildIds: [GuildId.cellToSingularity],
    };
  }
}
