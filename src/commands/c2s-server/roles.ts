import {
  type Message,
  ActionRowBuilder,
  ButtonBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
  ButtonStyle,
} from 'discord.js';
import { c2sRoles, c2sRolesInformation, Category, attachments, GuildId } from '#constants/index';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { buildCustomId } from '#constants/components';

export default class Roles extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'roles',
      description: 'see the list of available roles for the c2s server',
      fullCategory: [Category.c2sServer],
      preconditions: ['C2SOnly'],
    });
  }

  public override sharedRun(builder: Command['SharedBuilder']) {
    const member = builder.member;
    const guildRoles = builder.client.guilds.cache.get(GuildId.cellToSingularity).roles.cache;

    const embed = new EmbedBuilder()
        .setTitle('C2S Roles')
        .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
        .setThumbnail(attachments.currentLogo.name)
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
      hasServerEvents = member.roles.cache.has(c2sRoles.server.serverEvents),
      components = [
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setDisabled(builder.guild.id != GuildId.cellToSingularity)
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: hasServerEvents ? 'remove-events' : 'add-events',
                id: member.user.id,
              }),
            )
            .setEmoji(hasServerEvents ? '❌' : '✅')
            .setLabel(hasServerEvents ? 'Remove Server Events Role' : 'Add Server Events Role')
            .setStyle(hasServerEvents ? ButtonStyle.Danger : ButtonStyle.Success),
        ),
      ];
    return { embeds: [embed], files: [attachments.currentLogo], components };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.reply(this.sharedRun(interaction));
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
      },
      {
        guildIds: [GuildId.cellToSingularity],
      },
    );
  }
}
