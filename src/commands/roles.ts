import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import type { Message, Snowflake } from 'discord.js';
import { currentLogo, c2sGuildId } from '#config';
import type { Command } from '#lib/interfaces/Semblance';
import { c2sRoles, c2sRolesInformation } from '#constants/index';

export default {
  description: 'see the list of available roles for the c2s server',
  category: 'c2sServer',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'c2sServer'>;

const run = async (message: Message) => {
  const embed = new MessageEmbed()
      .setTitle('C2S Roles')
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
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
    hasServerEvents = message.member.roles.cache.has(c2sRoles.serverEvents as Snowflake),
    components = [
      new MessageActionRow().addComponents([
        new MessageButton()
          .setDisabled(message.guild.id != c2sGuildId)
          .setCustomId(
            JSON.stringify({
              command: 'roles',
              action: hasServerEvents ? 'remove-events' : 'add-events',
              id: message.author.id,
            }),
          )
          .setEmoji(hasServerEvents ? '❌' : '✅')
          .setLabel(hasServerEvents ? 'Remove Server Events Role' : 'Add Server Events Role')
          .setStyle(hasServerEvents ? 'DANGER' : 'SUCCESS'),
      ]),
    ];
  message.channel.send({ embeds: [embed], files: [currentLogo], components });
};
