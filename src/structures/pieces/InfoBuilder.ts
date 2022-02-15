import { type Awaitable, Piece } from '@sapphire/framework';
import type { MessageOptions, InteractionReplyOptions, Interaction } from 'discord.js';

export class InfoBuilder extends Piece {
  public constructor(context: Piece.Context) {
    super(context);
  }

  build?(interaction: Interaction): Awaitable<string | MessageOptions | InteractionReplyOptions>;
}
