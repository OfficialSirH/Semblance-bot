import { c2sRoles, c2sRolesInformation, Category, attachments, GuildId, authorDefault } from '#constants/index';
import { buildCustomId } from '#constants/components';
import type { FastifyReply } from 'fastify';
import { Command } from '#structures/Command';
import { MessageFlags, ButtonStyle, type APIChatInputApplicationCommandGuildInteraction } from '@discordjs/core';
import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
} from '@discordjs/builders';

export default class Roles extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'roles',
      description: 'see the list of available roles for the c2s server',
      fullCategory: [Category.c2sServer],
    });
  }

  public override async chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
    const member = interaction.member;
    if (!member) {
      return this.client.api.interactions.reply(res, {
        flags: MessageFlags.Ephemeral,
        content: 'An issue occurred while trying to get your roles.',
      });
    }
    const guildRoles = this.client.cache.data.cellsRoles;

    if (!guildRoles) {
      return this.client.api.interactions.reply(res, {
        flags: MessageFlags.Ephemeral,
        content: 'An issue occurred while trying to get your roles.',
      });
    }

    const embed = new EmbedBuilder()
        .setTitle('C2S Roles')
        .setAuthor(authorDefault(member.user))
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
              .setEmoji({ name: hasServerEvents ? '❌' : '✅' })
              .setLabel(hasServerEvents ? 'Remove Server Events Role' : 'Add Server Events Role')
              .setStyle(hasServerEvents ? ButtonStyle.Danger : ButtonStyle.Success),
          )
          .toJSON(),
      ];

    await this.client.api.interactions.reply(res, {
      embeds: [embed.toJSON()],
      components,
      files: [attachments.currentLogo],
    });
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
      guildIds: [GuildId.cellToSingularity],
    };
  }
}
