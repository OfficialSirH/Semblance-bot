import { GuildId, Category, authorDefault, disableAllComponents } from '#constants/index';
import { buildCustomId } from '#constants/components';
import { Command } from '#structures/Command';
import {
  ButtonStyle,
  TextInputStyle,
  MessageFlags,
  Routes,
  type APIModalSubmitGuildInteraction,
  type APIChatInputApplicationCommandGuildInteraction,
  type APIMessageComponentButtonInteraction,
  type APIUser,
  type APIDMChannel,
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
import type { ParsedCustomIdData } from '#lib/interfaces/Semblance';

export default class Suggest extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'suggest',
      description: 'Submit suggestions for Cell to Singularity or the server.',
      fullCategory: [Category.c2sServer],
      componentParseOptions: {
        allowOthers: true,
        permissionLevel: 1,
      },
    });
  }

  public async modalRun(res: FastifyReply, interaction: APIModalSubmitGuildInteraction) {
    if (JSON.parse(interaction.data.custom_id).action === 'decline') {
      const userDM = (await this.client.rest.post(Routes.userChannels(), {
        body: {
          recipient_id: JSON.parse(interaction.data.custom_id).id,
        },
      })) as APIDMChannel;

      let declineReasonSent = true;

      await this.client.rest
        .post(Routes.channelMessages(userDM.id), {
          body: {
            content: `Your suggestion has been denied.\nReason: ${interaction.data.components[0].components[0].value}`,
          },
        })
        .catch(() => {
          declineReasonSent = false;
        });

      return this.client.api.interactions.reply(res, {
        content: `Your decline reason send status: ${
          declineReasonSent
            ? 'Sent'
            : `Failed to send\nHere's your reason: ${interaction.data.components[0].components[0].value}`
        }.`,
        flags: MessageFlags.Ephemeral,
      });
    }

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
      command: {
        name: this.name,
        description: this.description,
      },
      guildIds: [GuildId.cellToSingularity],
    };
  }

  public override async componentRun(
    res: FastifyReply,
    interaction: APIMessageComponentButtonInteraction,
    data: ParsedCustomIdData<'accept' | 'deny' | 'silent-deny'>,
  ) {
    if (!['accept', 'deny', 'silent-deny'].includes(data.action))
      return this.client.api.interactions.reply(res, { content: "Something ain't working right" });

    const disabledComponents = await disableAllComponents(interaction);

    // this piece of crap wants to keep spewing 'unknown webhook!!!', for the love of God, stfu
    await this.client.api.webhooks.editMessage(interaction.application_id, interaction.token, interaction.message.id, {
      content: `${data.action != 'accept' ? 'denied' : 'accepted'} by <@${interaction.member?.user.id}>`,
      components: disabledComponents,
    });

    if (data.action == 'silent-deny') return;

    const user = (await this.client.rest.get(Routes.user(data.id))) as APIUser;
    if (data.action == 'accept') {
      const userDm = (await this.client.rest.post(Routes.userChannels(), {
        body: {
          recipient_id: user.id,
        },
      })) as APIDMChannel;

      await this.client.rest.post(Routes.channelMessages(userDm.id), {
        body: {
          content:
            'Your suggestion has been accepted! ' +
            'Note: This does not mean that your suggestion is guaranteed to be added in the game or implemented into the server(depending on the type of suggestion). ' +
            'It just means that your suggestion has been accepted into being shown in the suggestions channel where the team may consider your suggestion.',
        },
      });

      await this.client.rest.post(
        Routes.channelMessages(this.client.cache.data.cellsChannels.find(c => c.name === 'suggestions')?.id as string),
        {
          body: {
            embeds: [
              new EmbedBuilder()
                .setAuthor(authorDefault(user))
                .setDescription(interaction.message.embeds[0].description as string),
            ],
          },
        },
      );

      return;
    }

    if (data.action == 'deny') {
      const modal = new ModalBuilder()
        .setTitle('Suggestion Decline')
        .setCustomId(
          buildCustomId({
            command: this.name,
            action: 'decline',
            id: user.id,
          }),
        )
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId('reason')
              .setLabel('Decline Reason')
              .setStyle(TextInputStyle.Paragraph)
              .setPlaceholder('Enter the reason for declining this suggestion here.')
              .setMinLength(100)
              .setMaxLength(4000)
              .setRequired(true),
          ),
        );

      await this.client.api.interactions.createModal(res, modal.toJSON());
    }
  }
}
