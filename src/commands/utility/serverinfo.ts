import type { Guild, Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { Categories, getPermissionLevel, randomColor } from '#constants/index';
import { Args, Command } from '@sapphire/framework';

export default class ServerInfo extends Command {
  public override name = 'serverinfo';
  public override description = 'Provides info on the current server';
  public override fullCategory = [Categories.utility];

  public override async messageRun(message: Message, args: Args) {
    let guild: Guild;
    if (getPermissionLevel(message.member) == 7) {
      const guildId = await args.pickResult('string');
      guild = guildId.success ? message.client.guilds.cache.get(guildId.value) : message.guild;
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
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
      .setColor(randomColor)
      .addFields(
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
      )
      .setFooter({ text: `Id: ${guild.id} | Server Created: ${serverCreated}` });
    await message.reply({ embeds: [embed] });
  }
}
