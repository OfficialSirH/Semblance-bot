import { type Awaitable, Piece } from '@sapphire/framework';
import type { MessageOptions, InteractionReplyOptions, Interaction, Message } from 'discord.js';

export class InfoBuilder extends Piece {
  public constructor(context: Piece.Context) {
    super(context);
  }

  build?<T extends Interaction | Message>(
    builder: T,
  ): Awaitable<string | (T extends Message ? MessageOptions : InteractionReplyOptions)>;
}

export interface InfoBuilder {
  BuildOption: Interaction | Message;
  Context: Piece.Context;
}
