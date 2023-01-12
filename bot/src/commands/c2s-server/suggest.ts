import { GuildId, Category, authorDefault } from '#constants/index';
import { buildCustomId } from '#constants/components';
import { Command } from '#structures/Command';
import {
  ButtonStyle,
  TextInputStyle,
  MessageFlags,
  Routes,
  type APIModalSubmitGuildInteraction,
  type APIChatInputApplicationCommandGuildInteraction,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';
import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
} from '@discordjs/builders';

export default class Suggest extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'suggest',
      description: 'Submit suggestions for Cell to Singularity or the server.',
      fullCategory: [Category.c2sServer],
    });
  }

  public async modalRun(res: FastifyReply, interaction: APIModalSubmitGuildInteraction) {
    const suggestion = interaction.data.components[0].components[0].value;
    const member = interaction.member;

    const embed = new EmbedBuilder().setAuthor(authorDefault(member.user)).setDescription(suggestion),
      component = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel('Accept')
          .setStyle(ButtonStyle.Success)
          .setEmoji({ name: '✅' })
          .setCustomId(
            buildCustomId({
              command: this.name,
              action: 'accept',
              id: member.user.id,
            }),
          ),
        new ButtonBuilder()
          .setLabel('Deny')
          .setStyle(ButtonStyle.Danger)
          .setEmoji({ name: '❌' })
          .setCustomId(
            buildCustomId({
              command: this.name,
              action: 'deny',
              id: member?.user.id,
            }),
          ),
        new ButtonBuilder()
          .setLabel('Silent Deny')
          .setStyle(ButtonStyle.Danger)
          .setEmoji({ name: '❌' })
          .setCustomId(
            buildCustomId({
              command: this.name,
              action: 'silent-deny',
              id: interaction.member.user.id,
            }),
          ),
      );

    const suggestionReviewChannel = this.client.cache.data.cellsChannels.find(c => c.name == 'suggestion-review');
    await this.client.rest.post(Routes.channelMessages(suggestionReviewChannel?.id as string), {
      body: {
        embeds: [embed.toJSON()],
        components: [component.toJSON()],
      },
    });

    await this.client.api.interactions.reply(res, {
      content:
        'Your suggestion was recorded successfully! The moderators will first review your suggestion before allowing it onto the suggestions channel. ' +
        "You'll receive a DM when your suggestion is either accepted or denied so make sure to have your DMs opened.",
      flags: MessageFlags.Ephemeral,
    });
  }

  public override async chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
    const modal = new ModalBuilder()
      .setTitle('Suggestion')
      .setCustomId(
        buildCustomId({
          command: this.name,
          action: 'submit',
          id: interaction.member.user.id,
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

    await this.client.api.interactions.createModal(res, modal.toJSON());
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
      guildIds: [GuildId.cellToSingularity],
    };
  }
}
