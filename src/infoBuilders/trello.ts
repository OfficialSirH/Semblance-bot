import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';

export default class Trello extends InfoBuilder {
  public override name = 'trello';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build() {
    const embed = new Embed()
      .setDescription("[Semblance's Trello board](https://trello.com/b/Zhrs5AaN/semblance-project)")
      .setColor(randomColor);
    return { embeds: [embed] };
  }
}
