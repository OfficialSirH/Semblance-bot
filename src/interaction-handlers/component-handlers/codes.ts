import { ActionRow, ButtonComponent, type ButtonInteraction, ButtonStyle, Embed } from 'discord.js';
import { currentLogo } from '#config';
import { InteractionHandler, InteractionHandlerTypes, type PieceContext } from '@sapphire/framework';
import type { ParsedCustomIdData } from 'Semblance';
import { buildCustomId, componentInteractionDefaultParser } from '#src/constants/components';

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

  public override async run(interaction: ButtonInteraction, data: ParsedCustomIdData<'expired' | 'valid'>) {
    const codeHandler = await interaction.client.db.information.findUnique({ where: { type: 'codes' } });
    let embed = interaction.message.embeds[0] as Embed;
    if (!('setDescription' in embed)) embed = new Embed(embed);
    let component: ActionRow;

    switch (data.action) {
      case 'expired':
        embed.setDescription(codeHandler.expired);
        component = new ActionRow().addComponents(
          new ButtonComponent()
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'valid',
                id: interaction.user.id,
              }),
            )
            .setLabel('View Valid Codes')
            .setStyle(ButtonStyle.Primary),
        );
        break;
      case 'valid':
        embed.setDescription(codeHandler.value);
        component = new ActionRow().addComponents(
          new ButtonComponent()
            .setCustomId(
              buildCustomId({
                command: 'codes',
                action: 'expired',
                id: interaction.user.id,
              }),
            )
            .setLabel('View Expired Codes')
            .setStyle(ButtonStyle.Primary),
        );
        break;
      default:
        return;
    }

    embed.setThumbnail(currentLogo.name);
    await interaction.update({ embeds: [embed], components: [component] });
  }
}
