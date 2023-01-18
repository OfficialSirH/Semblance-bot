import { Category, randomColor } from '#constants/index';
import { Command } from '#structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import { ChannelType } from '@discordjs/core';
import type { FastifyReply } from 'fastify';

export default class ServerInfo extends Command {
  public override name = 'serverinfo';
  public override description = 'Provides info on the current server';
  public override category = [Category.utility];

  public override async chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
    const guild = interaction.guild;

    let textChannel = 0,
      voiceChannel = 0,
      categoryChannel = 0;
    guild.channels.cache.forEach(channel => {
      if (channel.type == ChannelType.GuildText) {
        textChannel++;
      }
      if (channel.type == ChannelType.GuildVoice) {
        voiceChannel++;
      }
      if (channel.type == ChannelType.GuildCategory) {
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
    const embed = new EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() as string })
      .setColor(randomColor)
      .addFields(
        { name: 'Owner', value: owner.toString(), inline: true },
        {
          name: 'Channel Category',
          value: categoryChannel.toString(),
          inline: true,
        },
        { name: 'Text Channels', value: textChannel.toString(), inline: true },
        { name: 'Voice Channels', value: voiceChannel.toString(), inline: true },
        {
          name: 'Members',
          value: fetchedGuild.approximateMemberCount?.toString() as string,
          inline: true,
        },
        { name: 'Roles', value: roleCount.toString(), inline: true },
        { name: 'Role List', value: canRoleListWork, inline: false },
      )
      .setFooter({ text: `Id: ${guild.id} | Server Created: ${serverCreated}` });
    await this.client.api.interactions.reply(res, { embeds: [embed.toJSON()] });
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description, dm_permission: false },
    };
  }
}
