import type { ButtonInteraction } from 'discord.js';
import { Collection, MessageActionRow, MessageButton } from 'discord.js';
import { c2sRoles } from '#constants/index';
import { c2sGuildId, currentLogo } from '#config';
import { componentInteractionDefaultParser, buildCustomId } from '#constants/components';
import { InteractionHandler, type PieceContext, InteractionHandlerTypes } from '@sapphire/framework';
import type { ParsedCustomIdData } from 'Semblance';
const cooldown: Collection<string, number> = new Collection();

export default class Roles extends InteractionHandler {
  public constructor(context: PieceContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      name: 'roles',
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction) {
    return componentInteractionDefaultParser(this, interaction);
  }

  public override async run(
    interaction: ButtonInteraction<'cached'>,
    data: ParsedCustomIdData<'add-events' | 'remove-events'>,
  ) {
    const { user, member, guild } = interaction,
      userCooldown = cooldown.get(user.id);
    if (!userCooldown || (!!userCooldown && Date.now() - userCooldown > 0)) cooldown.set(user.id, Date.now() + 30000);
    if (!!userCooldown && Date.now() - userCooldown < 0)
      return await interaction.reply({
        content: `You're on cooldown for ${(userCooldown - Date.now()) / 1000} seconds`,
        ephemeral: true,
      });

    const isAddingRole = data.action == 'add-events',
      components = [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setDisabled(guild.id != c2sGuildId)
            .setCustomId(
              buildCustomId({
                command: 'roles',
                action: isAddingRole ? 'remove-events' : 'add-events',
                id: interaction.user.id,
              }),
            )
            .setEmoji(isAddingRole ? '❌' : '✅')
            .setLabel(isAddingRole ? 'Remove Server Events Role' : 'Add Server Events Role')
            .setStyle(isAddingRole ? 'DANGER' : 'SUCCESS'),
        ),
      ];

    if (data.action == 'add-events') {
      await member.roles.add(c2sRoles.server.serverEvents);
      await interaction.reply({
        content: "Server Events role successfully added! Now you'll receive notifications for our server events! :D",
        ephemeral: true,
      });
    } else if (data.action == 'remove-events') {
      await member.roles.remove(c2sRoles.server.serverEvents);
      await interaction.reply({
        content:
          "Server Events role successfully removed. You'll stop receiveing notifications for our server events. :(",
        ephemeral: true,
      });
    }
    const embed = interaction.message.embeds[0].setThumbnail(currentLogo.name);
    await interaction.message.edit({ embeds: [embed], components });
  }
}