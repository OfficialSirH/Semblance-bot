import {
  type MessageActionRowComponentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  type ButtonInteraction,
  EmbedBuilder,
  ButtonStyle,
} from 'discord.js';
import { attachments } from '#constants/index';
import { InteractionHandler, InteractionHandlerTypes, type PieceContext } from '@sapphire/framework';
import type { ParsedCustomIdData } from '#lib/interfaces/Semblance';
import { buildCustomId, componentInteractionDefaultParser } from '#constants/components';

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
    const embed = new EmbedBuilder(interaction.message.embeds[0]);
    let component: ActionRowBuilder<MessageActionRowComponentBuilder>;

    switch (data.action) {
      case 'expired':
        embed.setDescription(codeHandler.expired);
        component = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
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
        component = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
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
    }

    embed.setThumbnail(attachments.currentLogo.name);
    await interaction.update({ embeds: [embed], components: [component] });
  }
}
