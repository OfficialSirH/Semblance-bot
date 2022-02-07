import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { c2sRoles, c2sRolesInformation } from '#constants/index';
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import type { Snowflake, GuildMember } from 'discord.js';
import { currentLogo, c2sGuildId } from '#config';

export const build: QueriedInfoBuilder = interaction => {
  const member = interaction.member as GuildMember;

  const embed = new MessageEmbed()
      .setTitle('C2S Roles')
      .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
      .setThumbnail(currentLogo.name)
      .setDescription(
        [
          [
            '**Server Roles**\n',
            ...Object.keys(c2sRolesInformation.server).map(
              role => `<@${c2sRoles[role]}>: ${c2sRolesInformation.server[role]}`,
            ),
          ].join('\n'),
          [
            '**Simulation Roles**\n',
            ...Object.keys(c2sRolesInformation.simulation).map(
              role => `<@${c2sRoles[role]}>: ${c2sRolesInformation.simulation[role]}`,
            ),
          ].join('\n'),
          [
            '**Metabit Roles**\n',
            ...Object.keys(c2sRolesInformation.metabit).map(
              role => `<@${c2sRoles[role]}>: ${c2sRolesInformation.metabit[role]}`,
            ),
          ].join('\n'),
          [
            '**Mesozoic Valley Roles**\n',
            ...Object.keys(c2sRolesInformation.mesozoic).map(
              role => `<@${c2sRoles[role]}>: ${c2sRolesInformation.mesozoic[role]}`,
            ),
          ].join('\n'),
          [
            '**Beyond Roles**\n',
            ...Object.keys(c2sRolesInformation.beyond).map(
              role => `<@${c2sRoles[role]}>: ${c2sRolesInformation.beyond[role]}`,
            ),
          ].join('\n'),
        ].join('\n\n'),
      )
      .setFooter('*Epic* roles.'),
    hasServerEvents = member.roles.cache.has(c2sRoles.serverEvents as Snowflake),
    components = [
      new MessageActionRow().addComponents([
        new MessageButton()
          .setDisabled(interaction.guild.id != c2sGuildId)
          .setCustomId(
            JSON.stringify({
              command: 'roles',
              action: hasServerEvents ? 'remove-events' : 'add-events',
              id: interaction.user.id,
            }),
          )
          .setEmoji(hasServerEvents ? '❌' : '✅')
          .setLabel(hasServerEvents ? 'Remove Server Events Role' : 'Add Server Events Role')
          .setStyle(hasServerEvents ? 'DANGER' : 'SUCCESS'),
      ]),
    ];
  return { embeds: [embed], files: [currentLogo], components };
};
