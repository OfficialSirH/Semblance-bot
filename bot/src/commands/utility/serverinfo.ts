import { type ChatInputCommandInteraction, EmbedBuilder, ChannelType } from 'discord.js';
import { Category, randomColor } from '#constants/index';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';

export default class ServerInfo extends Command {
  public override name = 'serverinfo';
  public override description = 'Provides info on the current server';
  public override fullCategory = [Category.utility];

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
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
    await interaction.reply({ embeds: [embed] });
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
      dm_permission: false,
    });
  }
}