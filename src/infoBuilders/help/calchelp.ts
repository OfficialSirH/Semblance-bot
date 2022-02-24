// TODO: implement this info builder

import { prefix, randomColor } from '#src/constants';
import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { ActionRow, ButtonComponent, ButtonStyle, Embed } from 'discord.js';

export default class Calchelp extends InfoBuilder {
  public override name = 'calchelp';

  public override async build(builder: InfoBuilder['BuildOption']) {
    const client = builder.client;
    const user = 'user' in builder ? builder.user : builder.author;
    const calculatorCommands = client.stores
      .get('commands')
      .filter(c => c.category === 'calculator')
      .map(c => `**${prefix}${c.name}**`);

    const components = [
      new ActionRow().addComponents(
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'help',
              action: 'largenumbers',
              id: user.id,
            }),
          )
          .setLabel('Large Numbers')
          .setStyle(ButtonStyle.Primary),
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'help',
              action: 'metahelp',
              id: user.id,
            }),
          )
          .setLabel('Metabit Calculator')
          .setStyle(ButtonStyle.Primary),
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'help',
              action: 'itemhelp',
              id: user.id,
            }),
          )
          .setLabel('Item Calculator')
          .setStyle(ButtonStyle.Primary),
      ),
    ];
    const embed = new Embed()
      .setTitle('Calculator Help')
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(randomColor)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setDescription(calculatorCommands.join(', '));

    return { embeds: [embed], components };
  }
}
