import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { c2sRoles } from '#constants/index';
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import type { Snowflake, GuildMember } from 'discord.js';
import config from '#config';

export const build: QueriedInfoBuilder = interaction => {
  const { currentLogo, c2sGuildId } = config;
  const member = interaction.member as GuildMember;
  const embed = new MessageEmbed()
      .setTitle('C2S Roles')
      .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
      .setThumbnail(currentLogo.name)
      .setDescription(
        [
          '**Reality Expert**: This role is gained upon sending a screenshot of 1 trillion accumulated metabits from your ***stats page*** to <#496430259114082304>.',
          "**Paleontologist**: This role is gained once you've unlocked and sent a screenshot of the T-rex to <#496430259114082304>.",
          "**Beta Tester**: This role is gained when you've joined and sent proof of being part of the beta program for C2S to <#496430259114082304>.",
          "**Server Events**: This role can be obtained by pressing the button below, which this role means you'll get pinged for events happening in the server.",
          "**Martian Council**: This role is ***unobtainable*** as it's a moderator role so please stop asking how to get this role.",
          '**All of the other new roles**: https://canary.discord.com/channels/488478892873744385/496430259114082304/892369818387365910',
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
