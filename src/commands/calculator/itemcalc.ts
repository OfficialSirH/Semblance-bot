import { bigToName, Category, randomColor } from '#constants/index';
import {
  type InteractionResponse,
  type AutocompleteInteraction,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  ApplicationCommandOptionType,
} from 'discord.js';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { itemList } from '#itemList';
import type { ItemList } from '#lib/interfaces/ItemList';

export default class ItemCalc extends Command {
  public override name = 'itemcalc';
  public override description = 'calculate prices for items in-game';
  public override fullCategory = [Category.calculator];

  public async itemCalc(
    interaction: ChatInputCommandInteraction<'cached'>,
    options: {
      item: string;
      levelGains: number;
      currentLevel: number;
    },
  ): Promise<InteractionResponse<true>> {
    if (!options.currentLevel) options.currentLevel = 0;

    if (!options.item)
      return interaction.reply({
        content: "You forgot input for 'item'.",
        ephemeral: true,
      });

    if (!options.levelGains)
      return interaction.reply({
        content: "You forgot input for 'level'.",
        ephemeral: true,
      });

    let itemCost = 0,
      itemCostType = 'unknown currency';
    for (const key of Object.keys(itemList))
      if (itemList[key as keyof ItemList][options.item]) {
        itemCost = itemList[key as keyof ItemList][options.item].price;
        itemCostType = key;
      }

    if (!itemCost)
      return interaction.reply({
        content: "Your input for 'item' was invalid.",
        ephemeral: true,
      });
    let resultingPrice = 0;

    for (let i = options.currentLevel; i < options.levelGains + options.currentLevel; i++) {
      resultingPrice += itemCost * Math.pow(1.149999976158142, i);
      if (!isFinite(resultingPrice)) break;
    }
    const user = interaction.member.user,
      embed = new EmbedBuilder()
        .setTitle('Item Calculator Results')
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setColor(randomColor)
        .setDescription(
          [
            `Chosen item: ${options.item}`,
            `Current item level: ${options.currentLevel}`,
            `Item level goal: ${options.levelGains + options.currentLevel}`,
            `Resulting Price: ${bigToName(resultingPrice)} ${itemCostType}`,
          ].join('\n'),
        );
    return interaction.reply({ embeds: [embed] });
  }

  public async itemCalcRev(
    interaction: ChatInputCommandInteraction<'cached'>,
    options: {
      item: string;
      currentAmount: string;
      currentLevel: number;
    },
  ): Promise<InteractionResponse<true>> {
    if (!options.currentLevel) options.currentLevel = 0;

    const currentAmount = parseFloat(options.currentAmount);

    let itemCost = 0,
      itemCostType = 'unknown currency';
    for (const key of Object.keys(itemList))
      if (itemList[key as keyof ItemList][options.item]) {
        itemCost = itemList[key as keyof ItemList][options.item].price;
        itemCostType = key;
      }

    if (!itemCost)
      return interaction.reply({
        content: "Your input for 'item' was invalid.",
        ephemeral: true,
      });
    const num3 = currentAmount * 0.1499999761581421;
    const num5 = itemCost * Math.pow(1.149999976158142, options.currentLevel);
    const level = Math.floor(Math.log(num3 / num5 + 1) / Math.log(1.149999976158142));
    const user = interaction.member.user,
      embed = new EmbedBuilder()
        .setTitle('Item Calculator Results')
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setColor(randomColor)
        .setDescription(
          [
            `Chosen item: ${options.item}`,
            `Current item level: ${options.currentLevel}`,
            `currency input: ${bigToName(currentAmount)} ${itemCostType}`,
            `Resulting level: ${level}`,
          ].join('\n'),
        );
    return interaction.reply({ embeds: [embed] });
  }

  public override chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    const chosenCalculator = interaction.options.getSubcommand();
    if (chosenCalculator === 'required_resources') {
      const item = interaction.options.getString('item', true);
      const levelGains = interaction.options.getNumber('level_gains', true);
      const currentLevel = interaction.options.getNumber('current_level') || 0;
      return this.itemCalc(interaction, { item, levelGains, currentLevel });
    }
    if (chosenCalculator === 'obtainable_levels') {
      const item = interaction.options.getString('item', true);
      const currentAmount = interaction.options.getString('current_amount', true);
      const currentLevel = interaction.options.getNumber('current_level') || 0;
      return this.itemCalcRev(interaction, { item, currentAmount, currentLevel });
    }
  }

  public override async autocompleteRun(interaction: AutocompleteInteraction<'cached'>) {
    const inputtedItem = interaction.options.getFocused() as string;

    const fullList = Object.keys(itemList).reduce<Array<string>>(
      (acc, currency) => acc.concat(Object.keys(itemList[currency as keyof ItemList])),
      [],
    );

    const filteredList = fullList
      .filter(item => item.startsWith(inputtedItem))
      .slice(0, 25)
      .map(item => ({ name: item, value: item }));

    if (filteredList.length === 0) return;
    await interaction.respond(filteredList);
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'required_resources',
            description: 'Calculate the required resources to level up an item a specified amount',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: 'item',
                description: 'The item to calculate the required resources for',
                type: ApplicationCommandOptionType.String,
                autocomplete: true,
                required: true,
              },
              {
                name: 'level_gains',
                description: 'The amount of levels you wish to gain',
                type: ApplicationCommandOptionType.Number,
                required: true,
              },
              {
                name: 'current_level',
                description: 'The current level of the item',
                type: ApplicationCommandOptionType.Number,
              },
            ],
          },
          {
            name: 'obtainable_levels',
            description: 'Calculate the number of levels an item can obtain with specified resources',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: 'item',
                description: 'The item to calculate the required resources for',
                type: ApplicationCommandOptionType.String,
                autocomplete: true,
                required: true,
              },
              {
                name: 'current_amount',
                description: "The amount of currency you've got available for the item",
                type: ApplicationCommandOptionType.String,
                required: true,
              },
              {
                name: 'current_level',
                description: 'The current level of the item',
                type: ApplicationCommandOptionType.Number,
              },
            ],
          },
        ],
      },
      {},
    );
  }
}
