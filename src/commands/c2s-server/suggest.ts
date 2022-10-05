import { GuildId, Category } from '#constants/index';
import { buildCustomId } from '#constants/components';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { type ChatInputCommandInteraction, TextInputBuilder, ModalBuilder, ActionRowBuilder } from 'discord.js';

export default class Suggest extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'suggest',
      description: 'Submit suggestions for Cell to Singularity or the server.',
      fullCategory: [Category.c2sServer],
      preconditions: ['C2SOnly'],
    });
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    const modal = new ModalBuilder()
      .setTitle('Suggestion')
      .setCustomId(
        buildCustomId({
          command: this.name,
          action: 'submit',
          id: interaction.user.id,
        }),
      )
      .setComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('suggestion')
            .setLabel('Suggestion')
            .setStyle(2)
            .setPlaceholder('Enter your suggestion here.')
            .setMinLength(50)
            .setMaxLength(4000)
            .setRequired(true),
        ),
      );

    await interaction.showModal(modal);
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
      },
      {
        guildIds: [GuildId.cellToSingularity],
      },
    );
  }
}
