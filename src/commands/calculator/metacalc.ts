import { bigToName, Categories, randomColor } from '#constants/index';
import { ApplicationCommandOptionType, type ChatInputCommandInteraction, Embed } from 'discord.js';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';

export default class MetaCalc extends Command {
  public override name = 'metacalc';
  public override description = 'calculate the amount of metabits produced by entropy and ideas';
  public override fullCategory = [Categories.calculator];

  public async metaCalc(
    interaction: ChatInputCommandInteraction<'cached'>,
    options: {
      entropy: string;
      ideas: string;
    },
  ): Promise<void> {
    const parsedEntropy = parseFloat(options.entropy);
    const parsedIdeas = parseFloat(options.ideas);

    if (parsedEntropy)
      return interaction.reply({
        content: "Invalid input for 'entropy'.",
        ephemeral: true,
      });

    if (parsedIdeas)
      return interaction.reply({
        content: "Invalid input for 'ideas'.",
        ephemeral: true,
      });

    const metabits = Math.floor(Math.pow(parsedEntropy + parsedIdeas, 0.3333333333333333) / 10000 - 1),
      user = interaction.member.user,
      embed = new Embed()
        .setTitle('Metabits Produced')
        .setColor(randomColor)
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setDescription(
          `Entropy Input: ${parsedEntropy}\nIdea Input: ${parsedIdeas}\n\nMetabits Produced: ${
            metabits < 1 ? 0 : bigToName(metabits)
          }`,
        );
    return interaction.reply({ embeds: [embed] });
  }

  public async metaCalcRev(interaction: ChatInputCommandInteraction<'cached'>, metabits: number): Promise<void> {
    const accumulated = Math.floor(Math.pow((metabits + 1) * 10000, 1 / 0.3333333333333333)),
      user = interaction.member.user,
      embed = new Embed()
        .setTitle('Accumulation Requirements')
        .setColor(randomColor)
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setDescription(`Metabit Input: ${metabits}\n\nEntropy/Idea Accumulation Required: ${bigToName(accumulated)}`);
    return interaction.reply({ embeds: [embed] });
  }

  public override chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    const chosenCalculator = interaction.options.getSubcommand();

    if (chosenCalculator === 'obtainable_metabits') {
      const entropy = interaction.options.getString('entropy');
      const ideas = interaction.options.getString('ideas');
      return this.metaCalc(interaction, { entropy, ideas });
    }

    if (chosenCalculator === 'required_accumulation') {
      const metabits = interaction.options.getNumber('metabits');
      return this.metaCalcRev(interaction, metabits);
    }
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
      options: [
        {
          name: 'obtainable_metabits',
          description: 'Calculate the required resources to level up an item a specified amount',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'entropy',
              description: 'The amount of entropy to include in the calculation',
              type: ApplicationCommandOptionType.String,
              autocomplete: true,
            },
            {
              name: 'ideas',
              description: 'The amount of ideas to include in the calculation',
              type: ApplicationCommandOptionType.String,
            },
          ],
        },
        {
          name: 'required_accumulation',
          description: 'The amount of accumulated entropy and ideas required for a specified amount of metabits',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: 'metabits',
              description: 'The amount of metabits to calculate the required accumulation for',
              type: ApplicationCommandOptionType.Number,
            },
          ],
        },
      ],
    });
  }
}
