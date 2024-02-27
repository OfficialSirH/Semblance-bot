import { buildCustomId } from '#constants/components';
import { Category, GuildId, SuggestionConstants, authorDefault, disableAllComponents } from '#constants/index';
import { type CustomIdData, type ParsedCustomIdData } from '#lib/interfaces/Semblance';
import { Command } from '#structures/Command';
import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  type MessageActionRowComponentBuilder,
} from '@discordjs/builders';
import {
  ButtonStyle,
  MessageFlags,
  Routes,
  TextInputStyle,
  type APIChatInputApplicationCommandGuildInteraction,
  type APIDMChannel,
  type APIMessageComponentButtonInteraction,
  type APIModalSubmitGuildInteraction,
  type APIUser,
  type RESTPostAPIApplicationCommandsJSONBody,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';
import { scheduleJob } from 'node-schedule';

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
    const customData = JSON.parse(interaction.data.custom_id) as CustomIdData & { ident?: string };

    if (customData.action === 'decline') {
      const userDM = (await this.client.rest.post(Routes.userChannels(), {
        body: {
          recipient_id: customData.id,
        },
      })) as APIDMChannel;

      let declineReasonSent = true;

      const deniedSuggestionKey = SuggestionConstants.createUniqueKey(customData.id, customData.ident as string);
      const cachedDeniedSuggestion = this.client.cache.temp.deniedSuggestions.get(deniedSuggestionKey);
      if (cachedDeniedSuggestion) {
        cachedDeniedSuggestion.scheduledRemoval?.cancel();
        this.client.cache.temp.deniedSuggestions.delete(deniedSuggestionKey);
      }

      await this.client.rest
        .post(Routes.channelMessages(userDM.id), {
          body: {
            content: `Your suggestion has been denied.\nReason: ${interaction.data.components[0].components[0].value}`,
          },
        })
        .catch(() => {
          declineReasonSent = false;
        });

      if (declineReasonSent && cachedDeniedSuggestion)
        this.client.rest.post(Routes.channelMessages(userDM.id), {
          body: {
            content: `Your suggestion: \`\`\`\n${cachedDeniedSuggestion.suggestion}\n\`\`\``,
          },
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
    // Attachments are too much of a pain in the ass in this situation
    // // Suggestion Attachment Step 2: Grabbing the attachment from cache and removing it from cache
    // const cachedAttachment = this.client.cache.temp.suggestionAttachments.get(interaction.member.user.id);
    // const attachment = cachedAttachment?.attachment;
    // if (cachedAttachment) {
    //   cachedAttachment.scheduledRemoval.cancel();
    //   this.client.cache.temp.suggestionAttachments.delete(interaction.member.user.id);
    // }

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

    // This seems to be failing due to "content length specified in header not matching body length"
    // await this.client.rest.post(
    //   Routes.channelMessages(suggestionReviewChannel?.id as string),
    //   await resolveBodyWithAttachments({
    //     embeds: [embed.toJSON()],
    //     components: [component.toJSON()],
    //     files: attachment ? [attachment] : undefined,
    //   }),
    // );

    // this way actually sends the message without the above error but clearly doesn't do it correctly still
    // const response = (await resolveBodyWithAttachments({
    //   embeds: [embed.toJSON()],
    //   components: [component.toJSON()],
    //   files: attachment ? [attachment] : undefined,
    // })) as { headers: Record<string, string>; body: Readable };
    // const result = await request(
    //   'https://discord.com/api/v10' + Routes.channelMessages(suggestionReviewChannel?.id as string),
    //   {
    //     method: 'POST',
    //     body: response.body,
    //     headers: {
    //       ...response.headers,
    //       Authorization: `Bot ${token}`,
    //     },
    //   },
    // );
    // this.client.logger.error(`code: ${result.statusCode}\nbody: ${await result.body.text()}`);

    await this.client.api.interactions.reply(res, {
      content:
        'Your suggestion was recorded successfully! The moderators will first review your suggestion before allowing it onto the suggestions channel. ' +
        "You'll receive a DM when your suggestion is either accepted or denied so make sure to have your DMs opened.",
      flags: MessageFlags.Ephemeral,
    });
  }

  public override async chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
    // Attachments are too much of a pain in the ass in this situation
    // // Suggestion Attachment Step 1: caching the attachment and scheduling its removal
    // const attachment = options.getAttachment('attachment');
    // if (attachment) {
    //   // make sure the attachment is an image
    //   if (!attachment.content_type?.startsWith('image/'))
    //     return this.client.api.interactions.reply(res, {
    //       content: 'Invalid attachment type. Please make sure the attachment is an image.',
    //       flags: MessageFlags.Ephemeral,
    //     });

    //   if (this.client.cache.temp.suggestionAttachments.size >= SuggestionConstants.AttachmentCacheLimit)
    //     return this.client.api.interactions.reply(res, {
    //       content: `Attachment cache limit reached.
    //         This occurs when a lot of users are making suggestions that include attachments at the same time.
    //         Usually, this shouldn't happen so if you get this response again in 5 minutes, please contact <@${UserId.sirh}>`,
    //       flags: MessageFlags.Ephemeral,
    //     });

    //   request(attachment.url).then(async res => {
    //     const buffer = await res.body.arrayBuffer();
    //     const image = Buffer.from(buffer);
    //     const imageBase64 = image.toString('base64');
    //     const imageBase64URL = `data:${attachment.content_type};base64,${imageBase64}`;
    //     this.client.cache.temp.suggestionAttachments.set(interaction.member.user.id, {
    //       attachment: new Attachy(imageBase64URL, attachment.filename, true),
    //       scheduledRemoval: scheduleJob(new Date(Date.now() + SuggestionConstants.AttachmentCacheLifetime), () => {
    //         this.client.cache.temp.suggestionAttachments.delete(interaction.member.user.id);
    //       }),
    //     });
    //   });
    // }

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
      } satisfies RESTPostAPIApplicationCommandsJSONBody,
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

    if (data.action !== 'deny')
      await this.client.api.interactions.updateMessage(res, {
        content: `${data.action != 'accept' ? 'denied' : 'accepted'} by <@${interaction.member?.user.id}>`,
        components: disabledComponents,
      });
    else
      await this.client.rest.patch(Routes.channelMessage(interaction.channel.id, interaction.message.id), {
        body: {
          content: `${'denied'} by <@${interaction.member?.user.id}>`,
          components: disabledComponents,
        },
      });

    if (data.action == 'silent-deny') return;

    const user = (await this.client.rest.get(Routes.user(data.id))) as APIUser;
    const suggestion = interaction.message.embeds[0].description as string;

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
            embeds: [new EmbedBuilder().setAuthor(authorDefault(user)).setDescription(suggestion)],
          },
        },
      );

      return;
    }

    if (data.action == 'deny') {
      this.client.cache.temp.deniedSuggestions.set(SuggestionConstants.createUniqueKey(user.id, suggestion), {
        suggestion,
        scheduledRemoval: scheduleJob(new Date(Date.now() + SuggestionConstants.DeniedSuggestionCacheLifetime), () => {
          this.client.cache.temp.deniedSuggestions.delete(SuggestionConstants.createUniqueKey(user.id, suggestion));
        }),
      });

      const modal = new ModalBuilder()
        .setTitle('Suggestion Decline')
        .setCustomId(
          buildCustomId<CustomIdData & { ident: string }>({
            command: this.name,
            action: 'decline',
            id: user.id,
            ident: SuggestionConstants.createUniqueKey(user.id, suggestion).split('-')[1],
          }),
        )
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId('reason')
              .setLabel('Decline Reason')
              .setStyle(TextInputStyle.Paragraph)
              .setPlaceholder('Enter the reason for declining this suggestion here.')
              .setMaxLength(4000)
              .setRequired(true),
          ),
        );

      await this.client.api.interactions.createModal(res, modal.toJSON());
    }
  }
}
