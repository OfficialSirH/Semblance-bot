import type { ButtonInteraction } from 'discord.js';
import { InteractionHandler, InteractionHandlerTypes, type PieceContext } from '@sapphire/framework';
import { componentInteractionDefaultParser } from '#constants/components';

export default class Edit extends InteractionHandler {
  public constructor(context: PieceContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      name: 'edit',
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction) {
    return componentInteractionDefaultParser(this, interaction);
  }

  public override async run(interaction: ButtonInteraction) {
    return interaction.reply({ content: 'Not implemented yet.', ephemeral: true });
  }
}
