import { InteractionHandler, InteractionHandlerTypes, type PieceContext } from '@sapphire/framework';
import { componentInteractionDefaultParser } from '#constants/components';

export default class InfoEditor extends InteractionHandler {
  public constructor(context: PieceContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      name: 'info-editor',
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction): ReturnType<typeof componentInteractionDefaultParser> {
    return componentInteractionDefaultParser(this, interaction);
  }

  public override async run(interaction: ButtonInteraction) {
    return interaction.reply({ content: 'Not implemented yet.', ephemeral: true });
  }
}
