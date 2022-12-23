import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
  ButtonStyle,
} from 'discord.js';
import { c2sRoles, c2sRolesInformation, Category, attachments, GuildId, avatarUrl } from '#constants/index';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { buildCustomId } from '#constants/components';
import {
  type APIApplicationCommandInteraction,
  type APIInteractionResponse,
  InteractionResponseType,
  MessageFlags,
  Routes,
} from 'discord-api-types/v9';
import type { FastifyReply } from 'fastify';

export default class Roles extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'roles',
      description: 'see the list of available roles for the c2s server',
      fullCategory: [Category.c2sServer],
      preconditions: ['C2SOnly'],
    });
  }

  public override async applicationRun(res: FastifyReply, interaction: APIApplicationCommandInteraction) {
    const member = interaction.member;
    if (!member) {
      await this.container.client.rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
        body: {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            flags: MessageFlags.Ephemeral,
            content: 'An issue occurred while trying to get your roles.',
          },
        } satisfies APIInteractionResponse,
      });
      return;
    }
    const guildRoles = this.container.client.guilds.cache.get(GuildId.cellToSingularity)?.roles.cache;

    if (!guildRoles) {
      await this.container.client.rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
        body: {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            flags: MessageFlags.Ephemeral,
            content: 'An issue occurred while trying to get your roles.',
          },
        } satisfies APIInteractionResponse,
      });
      return;
    }

    const embed = new EmbedBuilder()
        .setTitle('C2S Roles')
        .setAuthor({
          name: `${member.user.username}#${member.user.discriminator}`,
          iconURL: avatarUrl(member.user),
        })
        .setThumbnail(attachments.currentLogo.url)
        .setDescription(
          [
            [
              '**Server Roles**\n',
              ...Object.keys(c2sRolesInformation.server).map(
                role =>
                  `${guildRoles.get(c2sRoles.server[role as keyof typeof c2sRoles['server']])?.name}: ${
                    c2sRolesInformation.server[role as keyof typeof c2sRoles['server']]
                  }`,
              ),
            ].join('\n'),
            [
              '**Simulation Roles**\n',
              ...Object.keys(c2sRolesInformation.simulation).map(
                role =>
                  `${guildRoles.get(c2sRoles.simulation[role as keyof typeof c2sRoles['simulation']])?.name}: ${
                    c2sRolesInformation.simulation[role as keyof typeof c2sRoles['simulation']]
                  }`,
              ),
            ].join('\n'),
            [
              '**Metabit Roles**\n',
              ...Object.keys(c2sRolesInformation.metabit).map(
                role =>
                  `${guildRoles.get(c2sRoles.metabit[role as keyof typeof c2sRoles['metabit']])?.name}: ${
                    c2sRolesInformation.metabit[role as keyof typeof c2sRoles['metabit']]
                  }`,
              ),
            ].join('\n'),
            [
              '**Mesozoic Valley Roles**\n',
              ...Object.keys(c2sRolesInformation.mesozoic).map(
                role =>
                  `${guildRoles.get(c2sRoles.mesozoic[role as keyof typeof c2sRoles['mesozoic']])?.name}: ${
                    c2sRolesInformation.mesozoic[role as keyof typeof c2sRoles['mesozoic']]
                  }`,
              ),
            ].join('\n'),
            [
              '**Beyond Roles**\n',
              ...Object.keys(c2sRolesInformation.beyond).map(
                role =>
                  `${guildRoles.get(c2sRoles.beyond[role as keyof typeof c2sRoles['beyond']])?.name}: ${
                    c2sRolesInformation.beyond[role as keyof typeof c2sRoles['beyond']]
                  }`,
              ),
            ].join('\n'),
          ].join('\n\n'),
        )
        .setFooter({ text: 'Epic roles.' }),
      hasServerEvents = member.roles.find(r => r === c2sRoles.server.serverEvents),
      components = [
        new ActionRowBuilder<MessageActionRowComponentBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setDisabled(interaction.guild_id != GuildId.cellToSingularity)
              .setCustomId(
                buildCustomId({
                  command: this.name,
                  action: hasServerEvents ? 'remove-events' : 'add-events',
                  id: member.user.id,
                }),
              )
              .setEmoji(hasServerEvents ? '❌' : '✅')
              .setLabel(hasServerEvents ? 'Remove Server Events Role' : 'Add Server Events Role')
              .setStyle(hasServerEvents ? ButtonStyle.Danger : ButtonStyle.Success),
          )
          .toJSON(),
      ];

    await this.container.client.api.interactions.reply(res, {
      embeds: [embed.toJSON()],
      components,
      files: [attachments.currentLogo],
    });
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
