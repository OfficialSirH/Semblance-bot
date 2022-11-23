import { GuildId, Category } from '#constants/index';
import { buildCustomId } from '#constants/components';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import {
  type ModalSubmitInteraction,
  type MessageActionRowComponentBuilder,
  type TextBasedChannel,
  type ChatInputCommandInteraction,
  TextInputBuilder,
  ModalBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';

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

  public async modalRun(interaction: ModalSubmitInteraction<'cached'>) {
    const suggestion = interaction.fields.getTextInputValue('suggestion');

    const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.tag,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(suggestion),
      component = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel('Accept')
          .setStyle(ButtonStyle.Success)
          .setEmoji('✅')
          .setCustomId(
            buildCustomId({
              command: this.name,
              action: 'accept',
              id: interaction.user.id,
            }),
          ),
        new ButtonBuilder()
          .setLabel('Deny')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('❌')
          .setCustomId(
            buildCustomId({
              command: this.name,
              action: 'deny',
              id: interaction.user.id,
            }),
          ),
        new ButtonBuilder()
          .setLabel('Silent Deny')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('❌')
          .setCustomId(
            buildCustomId({
              command: this.name,
              action: 'silent-deny',
              id: interaction.user.id,
            }),
          ),
      );

    (interaction.guild.channels.cache.find(c => c.name == 'suggestion-review') as TextBasedChannel).send({
      embeds: [embed],
      components: [component],
    });

    await interaction.reply({
      content:
        'Your suggestion was recorded successfully! The moderators will first review your suggestion before allowing it onto the suggestions channel. ' +
        "You'll receive a DM when your suggestion is either accepted or denied so make sure to have your DMs opened.",
      ephemeral: true,
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
