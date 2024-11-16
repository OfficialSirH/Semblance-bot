/* eslint-disable @typescript-eslint/no-unused-expressions */
import type { ParsedCustomIdData } from '#lib/types/Semblance';
import { currentPrice } from '#lib/utilities/commands';
import { buildCustomId, filterAction } from '#lib/utilities/components';
import { about, askConfirmation, collect, create, leaderboard, stats, upgrade, votes } from '#lib/utilities/idle-game';
import { Category, authorDefault, avatarUrl, randomColor } from '#lib/utilities/index';
import {
	ActionRowBuilder,
	ButtonBuilder,
	EmbedBuilder,
	chatInputApplicationCommandMention,
	type MessageActionRowComponentBuilder
} from '@discordjs/builders';
import {
	ApplicationCommandOptionType,
	ButtonStyle,
	MessageFlags,
	type APIChatInputApplicationCommandGuildInteraction,
	type APIMessageComponentButtonInteraction,
	type RESTPostAPIApplicationCommandsJSONBody
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';

export default class Game extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'game',
			description: 'An idle-game within Semblance',
			fullCategory: [Category.fun]
		});
	}

	public override async chatInputRun(
		res: FastifyReply,
		interaction: APIChatInputApplicationCommandGuildInteraction,
		options: InteractionOptionResolver
	) {
		if (options.getSubcommand() === 'stats') return this.stats(res, interaction, options);

		const { user } = interaction.member;

		const statsHandler = await this.container.prisma.game.findUnique({ where: { player: user.id } });
		const embed = new EmbedBuilder();
		let cost = Infinity;
		if (!statsHandler) {
			embed
				.setTitle("Semblance's Idle-Game")
				.setAuthor(authorDefault(user))
				.setDescription(
					[
						'Use the buttons below to play the game. :D',
						"If you can't see the buttons, you need to update your Discord.\n",
						'About - explains the game and its rules',
						'Collect - collect earnings',
						'Upgrade - upgrade profit',
						'Leaderboard - see top 20 players',
						'Vote - list of voting sites to earn bonus currency'
					].join('\n')
				);
		} else {
			embed
				.setTitle("Welcome back to Semblance's Idle-Game!")
				.setAuthor(authorDefault(user))
				.setColor(randomColor)
				.setThumbnail(avatarUrl(user))
				.addFields(
					{ name: 'Level', value: statsHandler.level.toString() },
					{
						name: 'Random-Bucks',
						value: statsHandler.money.toFixed(3).toString()
					},
					{
						name: 'Percent Increase',
						value: statsHandler.percentIncrease.toString()
					},
					{
						name: 'Next Upgrade Cost',
						value: (await currentPrice(this.client, statsHandler)).toFixed(3).toString()
					},
					{
						name: 'Idle Profit',
						value: statsHandler.profitRate.toFixed(3).toString()
					}
				)
				.setFooter({ text: 'Remember to vote for Semblance to gain a production boost!' }),
				(cost = await currentPrice(this.client, statsHandler));
		}

		const components = [
			new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId(
						buildCustomId({
							command: 'game',
							action: 'about',
							id: user.id
						})
					)
					.setStyle(ButtonStyle.Primary)
					.setEmoji({ name: '❔' })
					.setLabel('About'),
				new ButtonBuilder()
					.setCustomId(
						buildCustomId({
							command: 'game',
							action: 'collect',
							id: user.id
						})
					)
					.setDisabled(!statsHandler)
					.setStyle(ButtonStyle.Primary)
					.setEmoji({ name: '💵' })
					.setLabel('Collect'),
				new ButtonBuilder()
					.setCustomId(
						buildCustomId({
							command: 'game',
							action: 'upgrade',
							id: user.id
						})
					)
					.setDisabled(!statsHandler || statsHandler.money < cost)
					.setStyle(ButtonStyle.Primary)
					.setEmoji({ name: '⬆' })
					.setLabel('Upgrade'),
				new ButtonBuilder()
					.setCustomId(
						buildCustomId({
							command: 'game',
							action: 'leaderboard',
							id: user.id
						})
					)
					.setStyle(ButtonStyle.Primary)
					.setEmoji({ name: '🏅' })
					.setLabel('Leaderboard'),
				new ButtonBuilder()
					.setCustomId(
						buildCustomId({
							command: 'game',
							action: 'vote',
							id: user.id
						})
					)
					.setStyle(ButtonStyle.Primary)
					.setEmoji({ name: '💰' })
					.setLabel('Voting Sites')
			)
		].map((row) => row.toJSON());

		await interaction.reply(res, {
			embeds: [embed.toJSON()],
			components
		});
	}

	async stats(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction, options: InteractionOptionResolver) {
		let user = options.getUser('user');
		if (!user) user = interaction.member.user;

		const statsHandler = await this.container.prisma.game.findUnique({ where: { player: user.id } });
		if (!statsHandler)
			return interaction.reply(res, {
				content:
					user.id != interaction.member.user.id
						? 'This user does not exist'
						: `You have not created a game yet; if you'd like to create a game, use \`${chatInputApplicationCommandMention(
								this.name,
								'create',
								this.client.cache.data.applicationCommands.find((c) => c.name === this.name)?.id as string
							)}\``,
				flags: MessageFlags.Ephemeral
			});
		const nxtUpgrade = await currentPrice(this.client, statsHandler);
		const embed = new EmbedBuilder()
			.setTitle(`${user.username}'s gamestats`)
			.setAuthor(authorDefault(user))
			.setColor(randomColor)
			.setThumbnail(avatarUrl(user))
			.addFields(
				{ name: 'Level', value: statsHandler.level.toString() },
				{ name: 'Random-Bucks', value: statsHandler.money.toString() },
				{
					name: 'Percent Increase',
					value: statsHandler.percentIncrease.toString()
				},
				{ name: 'Next Upgrade Cost', value: nxtUpgrade.toString() },
				{ name: 'Idle Profit', value: statsHandler.profitRate.toString() }
			)
			.setFooter({ text: 'Remember to vote for Semblance to gain a production boost!' });
		return interaction.reply(res, { embeds: [embed.toJSON()] });
	}

	public override data() {
		return {
			command: {
				name: this.name,
				description: this.description,
				options: [
					{
						name: 'stats',
						description: "View a user's stats in this little idle-game",
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: 'user',
								description: 'The user to display stats for.',
								type: ApplicationCommandOptionType.User
							}
						]
					},
					{
						name: 'play',
						description: 'Play the idle-game',
						type: ApplicationCommandOptionType.Subcommand
					}
				]
			} satisfies RESTPostAPIApplicationCommandsJSONBody
		};
	}

	public override async componentRun(
		reply: FastifyReply,
		interaction: APIMessageComponentButtonInteraction,
		data: ParsedCustomIdData<'create' | 'reset' | 'about' | 'collect' | 'upgrade' | 'leaderboard' | 'vote' | 'stats' | 'close'>
	) {
		const id = interaction.member?.user.id as string;
		const game = await this.container.prisma.game.findUnique({ where: { player: id } });
		let cost = Infinity;
		let components: ActionRowBuilder<MessageActionRowComponentBuilder>[];
		if (game) cost = await currentPrice(this.client, game);

		const mainComponents = [
			new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId(
						buildCustomId({
							command: this.name,
							action: 'about',
							id
						})
					)
					.setStyle(ButtonStyle.Primary)
					.setEmoji({ name: '❔' })
					.setLabel('About'),
				new ButtonBuilder()
					.setCustomId(
						buildCustomId({
							command: this.name,
							action: 'collect',
							id
						})
					)
					.setDisabled(!game)
					.setStyle(ButtonStyle.Primary)
					.setEmoji({ name: '💵' })
					.setLabel('Collect'),
				new ButtonBuilder()
					.setCustomId(
						buildCustomId({
							command: this.name,
							action: 'upgrade',
							id
						})
					)
					.setDisabled(!game || game.money < cost)
					.setStyle(ButtonStyle.Primary)
					.setEmoji({ name: '⬆' })
					.setLabel('Upgrade'),
				new ButtonBuilder()
					.setCustomId(
						buildCustomId({
							command: this.name,
							action: 'leaderboard',
							id
						})
					)
					.setStyle(ButtonStyle.Primary)
					.setEmoji({ name: '🏅' })
					.setLabel('Leaderboard'),
				new ButtonBuilder()
					.setCustomId(
						buildCustomId({
							command: this.name,
							action: 'vote',
							id
						})
					)
					.setStyle(ButtonStyle.Primary)
					.setEmoji({ name: '💰' })
					.setLabel('Voting Sites')
			)
		];
		const endComponents = [
			new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId(
						buildCustomId({
							command: this.name,
							action: 'stats',
							id
						})
					)
					.setDisabled(!game)
					.setStyle(ButtonStyle.Primary)
					.setEmoji({ name: '🔢' })
					.setLabel('Stats'),
				new ButtonBuilder()
					.setCustomId(
						buildCustomId({
							command: this.name,
							action: 'create',
							id
						})
					)
					.setEmoji({ name: game ? '⛔' : '🌎' })
					.setLabel(game ? 'Reset Progress' : 'Create new game')
					.setStyle(game ? ButtonStyle.Danger : ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId(
						buildCustomId({
							command: this.name,
							action: 'close',
							id
						})
					)
					.setEmoji({ name: '🚫' })
					.setLabel('Close')
					.setStyle(ButtonStyle.Secondary)
			)
		];
		if (['about', 'collect', 'upgrade', 'leaderboard', 'vote'].includes(data.action)) components = endComponents;
		else if (data.action == 'stats') components = mainComponents;
		else components = filterAction(endComponents, data.action);

		switch (data.action) {
			case 'create':
				await (game ? askConfirmation(this.client, reply, interaction, this.name) : create(this.client, reply, interaction, components));
				break;
			case 'reset':
				await create(this.client, reply, interaction, components);
				break;
			case 'about':
				await about(this.client, reply, interaction, components);
				break;
			case 'collect':
				await collect(this.client, reply, interaction, components);
				break;
			case 'upgrade':
				await upgrade(this.client, reply, interaction, components);
				break;
			case 'leaderboard':
				await leaderboard(this.client, reply, interaction, components);
				break;
			case 'vote':
				await votes(this.client, reply, interaction, components);
				break;
			case 'stats':
				if (!game)
					return interaction.reply(reply, {
						content: 'You do not have a game yet.',
						flags: MessageFlags.Ephemeral
					});
				await stats(this.client, reply, interaction, components, game);
				break;
			case 'close':
				await this.client.api.interactions.deleteReply(interaction, interaction.message?.id);
		}
	}
}
