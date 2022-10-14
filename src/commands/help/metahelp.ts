import { type Message, EmbedBuilder } from 'discord.js';
import { applicationCommandToMention, Category, randomColor } from '#constants/index';
import { Command } from '@sapphire/framework';
export default class MetaHelp extends Command {
  public override name = 'metahelp';
  public override description = 'help for metabit calculators';
  public override fullCategory = [Category.help];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const client = builder.client;
    const user = 'user' in builder ? builder.user : builder.author;

    const embed = new EmbedBuilder()
      .setTitle('Metabit Calculator Help')
      .setColor(randomColor)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setDescription(
        'The Metabit Calculator supports Scientific Notation, which means you can type numbers like 1E25. You can also input names for numbers like million all the way to vigintillion;' +
          ` Use ${applicationCommandToMention({
            client,
            commandName: 'help',
          })} and input 'largenumbers' into the query option to get more info on large numbers.`,
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
          value: `${applicationCommandToMention(
            {
              client,
              commandName: 'metacalc',
            },
            'obtainable_metabits',
          )} entropy: 1E23 ideas: 1.59E49, this example shows 1E23 entropy and 1.59E49 ideas being used for input.`,
        },
        {
          name: 'metacalcrev example',
          value: `${applicationCommandToMention(
            {
              client,
              commandName: 'metacalc',
            },
            'required_accumulation',
          )} metabits: 1E6, this example is using 1E6 (or 1 million) metabits as input.`,
        },
      )
      .setFooter({ text: 'Metabit Calculator goes brrr.' });
    return { embeds: [embed] };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
