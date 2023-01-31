import { c2sRoles, GuildId, attachments } from '#constants/index';
import { componentInteractionDefaultParser, buildCustomId } from '#constants/components';
import { InteractionHandler, type PieceContext, InteractionHandlerTypes } from '@sapphire/framework';
import type { ParsedCustomIdData } from '#lib/interfaces/Semblance';
import { EmbedBuilder } from '@discordjs/builders';
import { Collection } from '@discordjs/collection';
import { ButtonStyle } from '@discordjs/core';
// todo: remove this poor cooldown implementation and actually implement a cooldown that will actually remove the user from the cooldown collection after the cooldown is over
const cooldown: Collection<string, number> = new Collection();

export default class Roles extends InteractionHandler {
  public constructor(context: PieceContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      name: 'roles',
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction): ReturnType<typeof componentInteractionDefaultParser> {
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
      return await this.client.api.interactions.reply(res, {
        content: `You're on cooldown for ${(userCooldown - Date.now()) / 1000} seconds`,
        flags: MessageFlags.Ephemeral,
      });

    const isAddingRole = data.action == 'add-events',
      components = [
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setDisabled(guild.id != GuildId.cellToSingularity)
            .setCustomId(
              buildCustomId({
                command: 'roles',
                action: isAddingRole ? 'remove-events' : 'add-events',
                id: interaction.user.id,
              }),
            )
            .setEmoji(isAddingRole ? '❌' : '✅')
            .setLabel(isAddingRole ? 'Remove Server Events Role' : 'Add Server Events Role')
            .setStyle(isAddingRole ? ButtonStyle.Danger : ButtonStyle.Success),
        ),
      ];

    if (data.action == 'add-events') {
      await member.roles.add(c2sRoles.server.serverEvents);
      await this.client.api.interactions.reply(res, {
        content: "Server Events role successfully added! Now you'll receive notifications for our server events! :D",
        flags: MessageFlags.Ephemeral,
      });
    } else if (data.action == 'remove-events') {
      await member.roles.remove(c2sRoles.server.serverEvents);
      await this.client.api.interactions.reply(res, {
        content:
          "Server Events role successfully removed. You'll stop receiveing notifications for our server events. :(",
        flags: MessageFlags.Ephemeral,
      });
    }
    const embed = new EmbedBuilder(interaction.message.embeds.at(0)?.data).setThumbnail(attachments.currentLogo.url);
    await interaction.message.edit({ embeds: [embed.toJSON()], components });
  }
}
