import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { c2sRoles, c2sRolesInformation } from '#constants/index';
import { Embed, ActionRow, ButtonComponent, ButtonStyle } from 'discord.js';
import type { Snowflake, GuildMember } from 'discord.js';
import { currentLogo, c2sGuildId } from '#config';

export default class Roles extends InfoBuilder {
  public override name = 'roles';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build(builder: InfoBuilder['BuildOption']) {
    const member = builder.member as GuildMember;
    const guildRoles = builder.client.guilds.cache.get(c2sGuildId).roles.cache;

    const embed = new Embed()
        .setTitle('C2S Roles')
        .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
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
      hasServerEvents = member.roles.cache.has(c2sRoles.server.serverEvents as Snowflake),
      components = [
        new ActionRow().addComponents(
          new ButtonComponent()
            .setDisabled(builder.guild.id != c2sGuildId)
            .setCustomId(
              JSON.stringify({
                command: 'roles',
                action: hasServerEvents ? 'remove-events' : 'add-events',
                id: member.user.id,
              }),
            )
            .setEmoji({ name: hasServerEvents ? '❌' : '✅' })
            .setLabel(hasServerEvents ? 'Remove Server Events Role' : 'Add Server Events Role')
            .setStyle(hasServerEvents ? ButtonStyle.Danger : ButtonStyle.Success),
        ),
      ];
    return { embeds: [embed], files: [currentLogo], components };
  }
}
