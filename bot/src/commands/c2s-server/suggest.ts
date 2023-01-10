import { GuildId, Category } from '#constants/index';
import { buildCustomId } from '#constants/components';
import { Command } from '#structures/Command';
import {
  type APIApplicationCommandInteraction,
  ButtonStyle,
  TextInputStyle,
  type APIModalSubmitInteraction,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';

export default class Suggest extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'suggest',
      description: 'Submit suggestions for Cell to Singularity or the server.',
      category: [Category.c2sServer],
    });
  }

  public async modalRun(res: FastifyReply, interaction: APIModalSubmitInteraction) {
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

  public override async chatInputRun(res: FastifyReply, interaction: APIApplicationCommandInteraction) {
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
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Enter your suggestion here.')
            .setMinLength(100)
            .setMaxLength(4000)
            .setRequired(true),
        ),
      );

    await interaction.showModal(modal);
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
      guildIds: [GuildId.cellToSingularity],
    };
  }
}
