import { EmbedBuilder } from 'discord.js';
import { applicationCommandToMention, Category, randomColor } from '#constants/index';
import { Command } from '#structures/Command';

export default class ItemHelp extends Command {
  public override name = 'itemhelp';
  public override description = 'Get help with the item calculator commands';
  public override category = [Category.help];

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const { client } = interaction;
    const itemcalc = applicationCommandToMention(
      {
        client,
        commandName: 'itemcalc',
      },
      'required_resources',
    );
    const itemcalcrev = applicationCommandToMention(
      {
        client,
        commandName: 'itemcalc',
      },
      'obtainable_levels',
    );

    const embed = new EmbedBuilder()
      .setTitle('Item Calculator Help')
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setColor(randomColor)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(
        `The item calculator's command is done by doing ${itemcalc} <item name> <item level> <current lvl> or ${itemcalcrev} <item name> <currency input> <current lvl>` +
          ", which any name that has more than one word has to include '-', for example: martian-factory.",
      )
      .addFields(
        {
          name: 'itemcalc example',
          value: `${itemcalc} item-name: dna level_gains: 100 current_level: 58, this example is taking "dna" to get the specific cost for dna, then "100" is used to specify what level you're trying to calculate, finally, "58" specifies the current level the item is at.`,
        },
        {
          name: 'itemcalcrev example',
          value: `${itemcalcrev} martian-factory current_ammount: 1E48 current_level: 148, this example uses the martian-factory for calculating the item's specific cost, then "1E48" is currency input for how much currency you're "spending", finally, "148" is your current level of the item you specified.`,
        },
      )
      .setFooter({ text: 'Item Calculator goes brrrr...' });

    return { embeds: [embed] };
  }
}
