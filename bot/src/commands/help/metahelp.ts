import { Category, randomColor } from '#constants/index';
import { Command } from '#structures/Command';
import { EmbedBuilder, chatInputApplicationCommandMention } from '@discordjs/builders';
export default class MetaHelp extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'metahelp',
      description: 'help for metabit calculators',
      fullCategory: [Category.help],
    });
  }

  public override templateRun() {
    const embed = new EmbedBuilder()
      .setTitle('Metabit Calculator Help')
      .setColor(randomColor)
      .setDescription(
        'The Metabit Calculator supports Scientific Notation, which means you can type numbers like 1E25. You can also input names for numbers like million all the way to vigintillion;' +
          ` Use ${chatInputApplicationCommandMention(
            'help',
            this.client.cache.data.applicationCommands.find(c => c.name === 'help')?.id as string,
          )} and input 'largenumbers' into the query option to get more info on large numbers.`,
      )
      .addFields(
        {
          name: 'metacalc',
          value:
            'This command requires two inputs: first entropy, then ideas, which this command will then add up the two inputs(accumulation) and process the amount of metabits that would produce.',
        },
        {
          name: 'metacalcrev',
          value:
            'This command does the reverse of "metacalc" and will take in an input of metabits and process the accumulation of entropy&ideas you would need to produce that many metabits.',
        },
        {
          name: 'metacalc example',
          value: `${chatInputApplicationCommandMention(
            'metacalc',
            'obtainable_metabits',
            this.client.cache.data.applicationCommands.find(c => c.name === 'metacalc')?.id as string,
          )} entropy: 1E23 ideas: 1.59E49, this example shows 1E23 entropy and 1.59E49 ideas being used for input.`,
        },
        {
          name: 'metacalcrev example',
          value: `${chatInputApplicationCommandMention(
            'metacalc',
            'required_accumulation',
            this.client.cache.data.applicationCommands.find(c => c.name === 'metacalcrev')?.id as string,
          )} metabits: 1E6, this example is using 1E6 (or 1 million) metabits as input.`,
        },
      )
      .setFooter({ text: 'Metabit Calculator goes brrr.' });
    return { embeds: [embed.toJSON()] };
  }
}
