import { randomColor, prefix } from '#src/constants';
import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { Embed } from 'discord.js';

export default class Itemhelp extends InfoBuilder {
  public override name = 'itemhelp';

  public override async build(builder: InfoBuilder['BuildOption']) {
    const client = builder.client;
    const user = 'user' in builder ? builder.user : builder.author;

    const embed = new Embed()
      .setTitle('Item Calculator Help')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(
        `The item calculator's command is done by doing ${prefix}itemcalc <item name> <item level> <current lvl> or ${prefix}itemcalcrev <item name> <currency input> <current lvl>` +
          ", which any name that has more than one word has to include '-', for example: martian-factory.",
      )
      .addFields(
        {
          name: 'itemcalc example',
          value: `${prefix}itemcalc dna 100 58, this example is taking "dna" to get the specific cost for dna, then "100" is used to specify what level you're trying to calculate, finally, "58" specifies the current level the item is at.`,
        },
        {
          name: 'itemcalcrev example',
          value: `${prefix}itemcalcrev martian-factory 1E48 148, this example uses the martian-factory for calculating the item's specific cost, then "1E48" is fossil input for how many fossils you're "spending", finally, "148" is your current level of the item you specified.`,
        },
      )
      .setFooter({ text: 'Item Calculator goes brrrr...' });

    return { embeds: [embed] };
  }
}
