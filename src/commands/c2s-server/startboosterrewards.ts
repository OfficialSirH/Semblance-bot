import { c2sGuildId } from '#config';
import { Categories } from '#constants/index';
import { boosterRole, createBoosterRewards } from '#constants/models';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';

export default class StartBoosterRewards extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'startboosterrewards',
      description: 'Start retrieving booster rewards after you boost the server.',
      fullCategory: [Categories.c2sServer],
    });
  }

  public async chatInputRun(interaction: CommandInteraction<'cached'>) {
    if (!interaction.member.roles.cache.has(boosterRole))
      return interaction.reply({ content: 'You need to have the booster role to use this command.', ephemeral: true });

    return interaction.reply(await createBoosterRewards(interaction.client, interaction.user.id));
  }

  public registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
      },
      {
        guildIds: [c2sGuildId],
        idHints: ['995106586865434676'],
      },
    );
  }
}
