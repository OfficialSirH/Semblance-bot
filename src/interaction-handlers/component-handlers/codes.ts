import { ActionRow, ButtonComponent, ButtonInteraction, ButtonStyle, Embed } from 'discord.js';
import { currentLogo } from '#config';
import { InteractionHandler, InteractionHandlerTypes, type PieceContext } from '@sapphire/framework';
import type { CustomIdData } from 'Semblance';
import { componentInteractionDefaultParser } from '#src/constants/components';

export default class Codes extends InteractionHandler {
  public constructor(context: PieceContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      name: 'codes',
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction) {
    return componentInteractionDefaultParser(this, interaction);
  }

  public override async run(interaction: ButtonInteraction, data: Omit<CustomIdData, 'command'>) {
    const codeHandler = await interaction.client.db.information.findUnique({ where: { type: 'codes' } }),
      embed = interaction.message.embeds[0] as Embed;
    let component: ActionRow;
    if (data.action == 'expired') {
      embed.setDescription(codeHandler.expired);
      component = new ActionRow().addComponents(
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'codes',
              action: 'valid',
              id: interaction.user.id,
            }),
          )
          .setLabel('View Valid Codes')
          .setStyle(ButtonStyle.Primary),
      );
    } else if (data.action == 'valid') {
      embed.setDescription(codeHandler.value);
      component = new ActionRow().addComponents(
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'codes',
              action: 'expired',
              id: interaction.user.id,
            }),
          )
          .setLabel('View Expired Codes')
          .setStyle(ButtonStyle.Primary),
      );
    }
    embed.setThumbnail(currentLogo.name);
    await interaction.update({ embeds: [embed], components: [component] });
  }
}
