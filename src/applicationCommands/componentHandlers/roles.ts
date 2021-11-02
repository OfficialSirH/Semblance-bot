import type { ComponentHandler } from '#lib/interfaces/Semblance';
import type { Message, GuildMemberRoleManager } from 'discord.js';
import { Collection, MessageActionRow, MessageButton } from 'discord.js';
import { c2sRoles } from '#constants/index';
import config from '#config';
const { c2sGuildId, currentLogo } = config;
const cooldown: Collection<string, number> = new Collection();

export default {
  buttonHandle: async (interaction, { action, id }) => {
    const { user, member, guild } = interaction,
      userCooldown = cooldown.get(user.id);
    if (!userCooldown || (!!userCooldown && Date.now() - userCooldown > 0)) cooldown.set(user.id, Date.now() + 30000);
    if (!!userCooldown && Date.now() - userCooldown < 0)
      return await interaction.reply({
        content: `You're on cooldown for ${(userCooldown - Date.now()) / 1000} seconds`,
        ephemeral: true,
      });
    const isAddingRole = action == 'add-events',
      components = [
        new MessageActionRow().addComponents([
          new MessageButton()
            .setDisabled(guild.id != c2sGuildId)
            .setCustomId(
              JSON.stringify({
                command: 'roles',
                action: isAddingRole ? 'remove-events' : 'add-events',
                id,
              }),
            )
            .setEmoji(isAddingRole ? '❌' : '✅')
            .setLabel(isAddingRole ? 'Remove Server Events Role' : 'Add Server Events Role')
            .setStyle(isAddingRole ? 'DANGER' : 'SUCCESS'),
        ]),
      ];
    const message = interaction.message as Message;
    if (action == 'add-events') {
      await (member.roles as GuildMemberRoleManager).add(c2sRoles.serverEvents);
      await interaction.reply({
        content: "Server Events role successfully added! Now you'll receive notifications for our server events! :D",
        ephemeral: true,
      });
    } else if (action == 'remove-events') {
      await (member.roles as GuildMemberRoleManager).remove(c2sRoles.serverEvents);
      await interaction.reply({
        content:
          "Server Events role successfully removed. You'll stop receiveing notifications for our server events. :(",
        ephemeral: true,
      });
    }
    const embed = message.embeds[0].setThumbnail(currentLogo.name);
    await message.edit({ embeds: [embed], components });
  },
} as ComponentHandler;
