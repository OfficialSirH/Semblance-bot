import { ActionRow, ButtonComponent, Embed } from 'discord.js';
import type { Message, Snowflake } from 'discord.js';
import { currentLogo, c2sGuildId } from '#config';
import { Command } from '@sapphire/framework';
import { c2sRoles, c2sRolesInformation } from '#constants/index';
import type { SapphireClient } from '@sapphire/framework';

export default {
  description: 'see the list of available roles for the c2s server',
  category: 'c2sServer',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message) => run(client, message),
} as Command<'c2sServer'>;

const run = async (client: SapphireClient, message: Message) => {
  const guildRoles = client.guilds.cache.get(c2sGuildId).roles.cache;
  const embed = new Embed()
      .setTitle('C2S Roles')
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
      .setThumbnail(currentLogo.name)
      .setDescription(
        [
          [
            '**Server Roles**\n',
            ...Object.keys(c2sRolesInformation.server).map(
              role => `${guildRoles.get(c2sRoles.server[role]).name}: ${c2sRolesInformation.server[role]}`,
            ),
          ].join('\n'),
          [
            '**Simulation Roles**\n',
            ...Object.keys(c2sRolesInformation.simulation).map(
              role => `${guildRoles.get(c2sRoles.simulation[role]).name}: ${c2sRolesInformation.simulation[role]}`,
            ),
          ].join('\n'),
          [
            '**Metabit Roles**\n',
            ...Object.keys(c2sRolesInformation.metabit).map(
              role => `${guildRoles.get(c2sRoles.metabit[role]).name}: ${c2sRolesInformation.metabit[role]}`,
            ),
          ].join('\n'),
          [
            '**Mesozoic Valley Roles**\n',
            ...Object.keys(c2sRolesInformation.mesozoic).map(
              role => `${guildRoles.get(c2sRoles.mesozoic[role]).name}: ${c2sRolesInformation.mesozoic[role]}`,
            ),
          ].join('\n'),
          [
            '**Beyond Roles**\n',
            ...Object.keys(c2sRolesInformation.beyond).map(
              role => `${guildRoles.get(c2sRoles.beyond[role]).name}: ${c2sRolesInformation.beyond[role]}`,
            ),
          ].join('\n'),
        ].join('\n\n'),
      )
      .setFooter({ text: '*Epic* roles.' }),
    hasServerEvents = message.member.roles.cache.has(c2sRoles.server.serverEvents as Snowflake),
    components = [
      new ActionRow().addComponents([
        new ButtonComponent()
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
          .setStyle(hasServerEvents ? ButtonStyle.Danger : ButtonStyle.Success),
      ]),
    ];
  message.channel.send({ embeds: [embed], files: [currentLogo], components });
};
