import { authorDefault, bigToName, Category, randomColor } from '#constants/index';
import { Command } from '#structures/Command';
import type { InteractionOptionResolver } from '#structures/InteractionOptionResolver';
import { EmbedBuilder } from '@discordjs/builders';
import {
  type APIChatInputApplicationCommandGuildInteraction,
  ApplicationCommandOptionType,
  type RESTPostAPIApplicationCommandsJSONBody,
  MessageFlags,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';

export default class MetaCalc extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'metacalc',
      description: 'calculate the amount of metabits produced by entropy and ideas',
      fullCategory: [Category.calculator],
    });
  }

  public async metaCalc(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: {
      entropy: string;
      ideas: string;
    },
  ) {
    const parsedEntropy = parseFloat(options.entropy);
    const parsedIdeas = parseFloat(options.ideas);

    if (!parsedEntropy)
      return this.client.api.interactions.reply(res, {
        content: "Invalid input for 'entropy'.",
        flags: MessageFlags.Ephemeral,
      });

    if (!parsedIdeas)
      return this.client.api.interactions.reply(res, {
        content: "Invalid input for 'ideas'.",
        flags: MessageFlags.Ephemeral,
      });

    const metabits = Math.floor(Math.pow(parsedEntropy + parsedIdeas, 0.3333333333333333) / 10000 - 1),
      embed = new EmbedBuilder()
        .setTitle('Metabits Produced')
        .setColor(randomColor)
        .setAuthor(authorDefault(interaction.member.user))
        .setDescription(
          `Entropy Input: ${parsedEntropy}\nIdea Input: ${parsedIdeas}\n\nMetabits Produced: ${
            metabits < 1 ? 0 : bigToName(metabits)
          }`,
        );
    return this.client.api.interactions.reply(res, { embeds: [embed.toJSON()] });
  }

  public async metaCalcRev(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    metabits: number,
  ) {
    const accumulated = Math.floor(Math.pow((metabits + 1) * 10000, 1 / 0.3333333333333333)),
      embed = new EmbedBuilder()
        .setTitle('Accumulation Requirements')
        .setColor(randomColor)
        .setAuthor(authorDefault(interaction.member.user))
        .setDescription(`Metabit Input: ${metabits}\n\nEntropy/Idea Accumulation Required: ${bigToName(accumulated)}`);
    return this.client.api.interactions.reply(res, { embeds: [embed.toJSON()] });
  }

  public override chatInputRun(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const chosenCalculator = options.getSubcommand();

    if (chosenCalculator === 'obtainable_metabits') {
      const entropy = options.getString('entropy', true);
      const ideas = options.getString('ideas', true);
      return this.metaCalc(res, interaction, { entropy, ideas });
    }

    if (chosenCalculator === 'required_accumulation') {
      const metabits = options.getNumber('metabits', true);
      return this.metaCalcRev(res, interaction, metabits);
    }
  }

  public override data() {
    return {
      command: {
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
                required: true,
              },
              {
                name: 'ideas',
                description: 'The amount of ideas to include in the calculation',
                type: ApplicationCommandOptionType.String,
                required: true,
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
                required: true,
              },
            ],
          },
        ],
      } satisfies RESTPostAPIApplicationCommandsJSONBody,
    };
  }
}
