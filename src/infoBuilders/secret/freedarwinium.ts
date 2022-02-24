import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { Embed, Message } from 'discord.js';

export default class Freedarwinium extends InfoBuilder {
  public override name = 'freedarwinium';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build(builder: InfoBuilder['BuildOption']) {
    const embed = new Embed().setTitle('Secret').setURL('https://rb.gy/enaq3a');
    return builder instanceof Message ? { embeds: [embed] } : { embeds: [embed], ephemeral: true };
  }
}
