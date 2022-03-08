import { MessageActionRow, MessageButton, type CommandInteraction, MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { currentLogo, c2sGuildId } from '#config';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { c2sRoles, c2sRolesInformation, Categories } from '#constants/index';
import { buildCustomId } from '#constants/components';

export default class Roles extends Command {
  public override name = 'roles';
  public override description = 'see the list of available roles for the c2s server';
  public override fullCategory = [Categories.c2sServer];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const member = builder.member;
    const guildRoles = builder.client.guilds.cache.get(c2sGuildId).roles.cache;

    const embed = new MessageEmbed()
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
      hasServerEvents = member.roles.cache.has(c2sRoles.server.serverEvents),
      components = [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setDisabled(builder.guild.id != c2sGuildId)
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: hasServerEvents ? 'remove-events' : 'add-events',
                id: member.user.id,
              }),
            )
            .setEmoji(hasServerEvents ? '❌' : '✅')
            .setLabel(hasServerEvents ? 'Remove Server Events Role' : 'Add Server Events Role')
            .setStyle(hasServerEvents ? 'DANGER' : 'SUCCESS'),
        ),
      ];
    return { embeds: [embed], files: [currentLogo], components };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }

  public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
    await interaction.reply(this.sharedRun(interaction));
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
      },
      {
        guildIds: [c2sGuildId],
      },
    );
  }
}
