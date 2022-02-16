import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import type { Piece } from '@sapphire/framework';
import { Embed, Message } from 'discord.js';
import type { InfoBuilderOption } from 'Semblance';

export default class Freedarwinium extends InfoBuilder {
  public override name = 'freedarwinium';

  public constructor(context: Piece.Context) {
    super(context);
  }

  public override async build(builder: InfoBuilderOption) {
    const embed = new Embed().setTitle('Secret').setURL('https://rb.gy/enaq3a');
    return builder instanceof Message ? { embeds: [embed] } : { embeds: [embed], ephemeral: true };
  }
}
