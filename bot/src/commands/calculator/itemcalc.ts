import { authorDefault, bigToName, Category, randomColor } from '#lib/utilities/index';
import { ItemList } from '#lib/utilities/itemList';
import { EmbedBuilder } from '@discordjs/builders';
import {
	ApplicationCommandOptionType,
	MessageFlags,
	type APIApplicationCommandAutocompleteInteraction,
	type APIChatInputApplicationCommandGuildInteraction,
	type RESTPostAPIApplicationCommandsJSONBody
} from '@discordjs/core';
import type { Command } from '@skyra/http-framework';
import type { FastifyReply } from 'fastify';

export default class ItemCalc extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'itemcalc',
			description: 'calculate prices for items in-game',
			fullCategory: [Category.calculator]
		});
	}

	public async itemCalc(
		res: FastifyReply,
		interaction: APIChatInputApplicationCommandGuildInteraction,
		options: {
			item: string;
			levelGains: number;
			currentLevel: number;
		}
	) {
		if (!options.currentLevel) options.currentLevel = 0;

		if (!options.item)
			return interaction.reply(res, {
				content: "You forgot input for 'item'.",
				flags: MessageFlags.Ephemeral
			});

		if (!options.levelGains)
			return interaction.reply(res, {
				content: "You forgot input for 'level'.",
				flags: MessageFlags.Ephemeral
			});

		let itemCost = 0;
		let itemCostType = 'unknown currency';
		for (const key of Object.keys(ItemList))
			if (ItemList[key as keyof ItemList][options.item]) {
				itemCost = ItemList[key as keyof ItemList][options.item].price;
				itemCostType = key;
			}

		if (!itemCost)
			return interaction.reply(res, {
				content: "Your input for 'item' was invalid.",
				flags: MessageFlags.Ephemeral
			});
		let resultingPrice = 0;

		for (let i = options.currentLevel; i < options.levelGains + options.currentLevel; i++) {
			resultingPrice += itemCost * Math.pow(1.149999976158142, i);
			if (!isFinite(resultingPrice)) break;
		}
		const embed = new EmbedBuilder()
			.setTitle('Item Calculator Results')
			.setAuthor(authorDefault(interaction.member.user))
			.setColor(randomColor)
			.setDescription(
				[
					`Chosen item: ${options.item}`,
					`Current item level: ${options.currentLevel}`,
					`Item level goal: ${options.levelGains + options.currentLevel}`,
					`Resulting Price: ${bigToName(resultingPrice)} ${itemCostType}`
				].join('\n')
			);
		return interaction.reply(res, { embeds: [embed.toJSON()] });
	}

	public async itemCalcRev(
		res: FastifyReply,
		interaction: APIChatInputApplicationCommandGuildInteraction,
		options: {
			item: string;
			currentAmount: string;
			currentLevel: number;
		}
	) {
		if (!options.currentLevel) options.currentLevel = 0;

		const currentAmount = parseFloat(options.currentAmount);

		let itemCost = 0;
		let itemCostType = 'unknown currency';
		for (const key of Object.keys(ItemList))
			if (ItemList[key as keyof ItemList][options.item]) {
				itemCost = ItemList[key as keyof ItemList][options.item].price;
				itemCostType = key;
			}

		if (!itemCost)
			return interaction.reply(res, {
				content: "Your input for 'item' was invalid.",
				flags: MessageFlags.Ephemeral
			});
		const num3 = currentAmount * 0.1499999761581421;
		const num5 = itemCost * Math.pow(1.149999976158142, options.currentLevel);
		const level = Math.floor(Math.log(num3 / num5 + 1) / Math.log(1.149999976158142));
		const embed = new EmbedBuilder()
			.setTitle('Item Calculator Results')
			.setAuthor(authorDefault(interaction.member.user))
			.setColor(randomColor)
			.setDescription(
				[
					`Chosen item: ${options.item}`,
					`Current item level: ${options.currentLevel}`,
					`currency input: ${bigToName(currentAmount)} ${itemCostType}`,
					`Resulting level: ${level}`
				].join('\n')
			);
		return interaction.reply(res, { embeds: [embed.toJSON()] });
	}

	public override chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction, options: InteractionOptionResolver) {
		const chosenCalculator = options.getSubcommand();
		if (chosenCalculator === 'required_resources') {
			const item = options.getString('item', true);
			const levelGains = options.getNumber('level_gains', true);
			const currentLevel = options.getNumber('current_level') || 0;
			return this.itemCalc(res, interaction, { item, levelGains, currentLevel });
		}
		if (chosenCalculator === 'obtainable_levels') {
			const item = options.getString('item', true);
			const currentAmount = options.getString('current_amount', true);
			const currentLevel = options.getNumber('current_level') || 0;
			return this.itemCalcRev(res, interaction, { item, currentAmount, currentLevel });
		}
	}

	public override async autocompleteRun(
		res: FastifyReply,
		_interaction: APIApplicationCommandAutocompleteInteraction,
		options: InteractionOptionResolver
	) {
		const inputtedItem = options.getString('item', true);

		const fullList = Object.keys(ItemList).reduce<Array<string>>(
			(acc, currency) => acc.concat(Object.keys(ItemList[currency as keyof ItemList])),
			[]
		);

		const filteredList = fullList
			.filter((item) => item.startsWith(inputtedItem))
			.slice(0, 25)
			.map((item) => ({ name: item, value: item }));

		if (filteredList.length === 0) return;
		await this.client.api.interactions.autocomplete(res, filteredList);
	}

	public override data() {
		return {
			command: {
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
								required: true
							},
							{
								name: 'level_gains',
								description: 'The amount of levels you wish to gain',
								type: ApplicationCommandOptionType.Number,
								required: true
							},
							{
								name: 'current_level',
								description: 'The current level of the item',
								type: ApplicationCommandOptionType.Number
							}
						]
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
								required: true
							},
							{
								name: 'current_amount',
								description: "The amount of currency you've got available for the item",
								type: ApplicationCommandOptionType.String,
								required: true
							},
							{
								name: 'current_level',
								description: 'The current level of the item',
								type: ApplicationCommandOptionType.Number
							}
						]
					}
				]
			} satisfies RESTPostAPIApplicationCommandsJSONBody
		};
	}
}
