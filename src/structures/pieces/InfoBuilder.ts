import { type Awaitable, Piece } from '@sapphire/framework';
import type { MessageOptions, InteractionReplyOptions, Interaction, Message } from 'discord.js';
import type { Category, Subcategory } from 'Semblance';

export class InfoBuilder extends Piece {
  public fullCategory: [Category, Subcategory] | [Category];

  public constructor(context: Piece.Context, options?: InfoBuilder['Option']) {
    super(context, options);
    this.fullCategory = options.fullCategory ?? (this.location.directories as [Category, Subcategory]);
  }

  public get category() {
    return this.fullCategory[0];
  }

  public get subcategory() {
    return this.fullCategory[1];
  }

  build?<T extends Interaction | Message>(
    builder: T,
  ): Awaitable<string | (T extends Message ? MessageOptions : InteractionReplyOptions)>;
}

export interface InfoBuilder {
  BuildOption: Interaction | Message;
  BuildResult: string | MessageOptions | InteractionReplyOptions;
  Context: Piece.Context;
  Option: Piece.Options & {
    fullCategory: [Category, Subcategory] | [Category];
  };
}
