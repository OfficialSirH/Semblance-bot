import type { Guild, Message, Snowflake } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { randomColor } from '#constants/index';
import type { Semblance } from '#structures/Semblance';
import type { Command } from '#lib/interfaces/Semblance';

export default {
  description: 'Provides info on the current server',
  category: 'server',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message, args, _identifier, { permissionLevel }) => run(client, message, args, { permissionLevel }),
} as Command<'server'>;

const run = async (client: Semblance, message: Message, args: string[], { permissionLevel }) => {
  let guild: Guild;
  if (args[0] && permissionLevel == 7) {
    const guildId = /\d{17,20}/.exec(args[0]);
    if (!guildId) return message.reply('WRONG! That id is invalid!');
    guild = client.guilds.cache.get(guildId[0] as Snowflake);
  } else guild = message.guild;

  let textChannel = 0,
    voiceChannel = 0,
    categoryChannel = 0;
  guild.channels.cache.forEach(channel => {
    if (channel.type == 'GUILD_TEXT') {
      textChannel++;
    }
    if (channel.type == 'GUILD_VOICE') {
      voiceChannel++;
    }
    if (channel.type == 'GUILD_CATEGORY') {
      categoryChannel++;
    }
  });

  const roleArray: string[] = [];
  let roleCount = 0;
  guild.roles.cache.forEach(role => {
    roleArray.push(role.name);
    roleCount++;
  });
  const roleList = roleArray.join(', ');

  let serverCreated = `${guild.createdAt}`;
  serverCreated = serverCreated.substring(0, 16);
  const canRoleListWork = roleList.length > 1024 ? '*Too many roles*' : roleList;
  const fetchedGuild = await guild.fetch();
  const owner = await guild.members.fetch(guild.ownerId);
  const embed = new MessageEmbed()
    .setAuthor(guild.name, guild.iconURL())
    .setColor(randomColor)
    .addFields([
      { name: 'Owner', value: owner.toString(), inline: true },
      {
        name: 'Channel Categories',
        value: categoryChannel.toString(),
        inline: true,
      },
      { name: 'Text Channels', value: textChannel.toString(), inline: true },
      { name: 'Voice Channels', value: voiceChannel.toString(), inline: true },
      {
        name: 'Members',
        value: fetchedGuild.approximateMemberCount.toString(),
        inline: true,
      },
      { name: 'Roles', value: roleCount.toString(), inline: true },
      { name: 'Role List', value: canRoleListWork, inline: false },
    ])
    .setFooter({ text: `Id: ${guild.id} | Server Created: ${serverCreated}` });
  message.channel.send({ embeds: [embed] });
};
