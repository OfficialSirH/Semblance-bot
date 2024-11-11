import {
	ActionRowBuilder,
	ButtonBuilder,
	EmbedBuilder,
	chatInputApplicationCommandMention,
	type MessageActionRowComponentBuilder
} from '@discordjs/builders';
import { ButtonStyle, Client, MessageFlags, type APIMessageComponentButtonInteraction } from '@discordjs/core';
import type { Game } from '@prisma/client';
import type { FastifyReply } from 'fastify';
import { currentPrice } from './commands.js';
import { buildCustomId, disableComponentsByLabel } from './components.js';
import { authorDefault, avatarUrl, randomColor } from './index.js';

export async function askConfirmation(client: Client, reply: FastifyReply, interaction: APIMessageComponentButtonInteraction, name: string) {
	const userId = interaction.member?.user.id as string;
	const components = [
		new ActionRowBuilder<MessageActionRowComponentBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId(
						buildCustomId({
							command: name,
							action: 'reset',
							id: userId
						})
					)
					.setEmoji({ name: '🚫' })
					.setLabel('Yes')
					.setStyle(ButtonStyle.Danger),
				new ButtonBuilder()
					.setCustomId(
						buildCustomId({
							command: name,
							action: 'close',
							id: userId
						})
					)
					.setLabel('No')
					.setStyle(ButtonStyle.Secondary)
			)
			.toJSON()
	];
	await client.api.interactions.updateMessage(reply, {
		content: 'Are you sure you want to reset your progress?',
		embeds: [],
		components
	});
}

export async function create(
	client: Client,
	reply: FastifyReply,
	interaction: APIMessageComponentButtonInteraction,
	components: ActionRowBuilder<MessageActionRowComponentBuilder>[]
) {
	const user = interaction.member?.user;
	const percent = (Math.round(Math.random() * 25) + 25) / 100 + 1;
	const startingProfits = Math.random() * 0.05 + 0.05;

	const creationHandler = await client.db.game.upsert({
		where: {
			player: user?.id
		},
		create: {
			player: user?.id as string,
			percentIncrease: percent,
			profitRate: startingProfits,
			cost: 1
		},
		update: {
			level: 1,
			checkedLevel: 1,
			money: 0,
			percentIncrease: percent,
			profitRate: startingProfits,
			cost: 1
		}
	});

	const embed = new EmbedBuilder()
		.setTitle('Game Created')
		.setAuthor(authorDefault(user))
		.setColor(randomColor)
		.setDescription(
			`Game Successfully created! Now you can start collecting Random-Bucks by using ${chatInputApplicationCommandMention(
				'game',
				client.cache.data.applicationCommands.find((c) => c.name === 'game')?.id as string
			)} and pressing 'collect' and upgrade with 'upgrade'\n\n` +
				`Price Increase: ${(creationHandler.percentIncrease - 1) * 100}%\n` +
				`Starting Profits: ${creationHandler.profitRate.toFixed(3)}/sec\n\n` +
				"Reminder, don't be constantly spamming and creating a new game just cause your RNG stats aren't perfect \n"
		)
		.setFooter({ text: 'Enjoy idling!' });
	components = disableComponentsByLabel(components, ['Collect', 'Stats'], { enableInstead: true });
	await client.api.interactions.updateMessage(reply, {
		embeds: [embed.toJSON()],
		components: components.map((c) => c.toJSON())
	});
}

export async function about(
	client: Client,
	reply: FastifyReply,
	interaction: APIMessageComponentButtonInteraction,
	components: ActionRowBuilder<MessageActionRowComponentBuilder>[]
) {
	const user = interaction.member?.user;
	const embed = new EmbedBuilder()
		.setTitle("What's Semblance's Idle-Game about?")
		.setAuthor(authorDefault(user))
		.setColor(randomColor)
		.setDescription(
			"SIG, AKA Semblance's Idle-Game, is an RNG idle-game that uses a currency called Random-Bucks \n" +
				'If you\'re confused by the acronym RNG, it\'s an acronym for "Random Number Generation/Generator", which ' +
				'means that everything is kind of random and runs on random chance in the game. Everything that is random ' +
				'within this game is the cost multiplier per upgrade, starting profits, and the amount your profits increase.\n\n' +
				'You have to collect Random-Bucks manually every once in a while, that is how the game works.'
		)
		.setFooter({ text: 'Noice' });
	await client.api.interactions.updateMessage(reply, {
		embeds: [embed.toJSON()],
		components: components.map((c) => c.toJSON())
	});
}

export async function collect(
	client: Client,
	reply: FastifyReply,
	interaction: APIMessageComponentButtonInteraction,
	components: ActionRowBuilder<MessageActionRowComponentBuilder>[]
) {
	const user = interaction.member?.user;
	let collectionHandler = await client.db.game.findUnique({ where: { player: user?.id } });
	if (!collectionHandler)
		return client.api.interactions.reply(reply, {
			content: 'You do not have a game yet.',
			flags: MessageFlags.Ephemeral
		});
	const collected = collectionHandler.profitRate * ((Date.now() - collectionHandler.lastCollected.valueOf()) / 1000);

	collectionHandler = await client.db.game.update({
		where: {
			player: user?.id
		},
		data: {
			money: {
				increment: collected
			}
		}
	});

	const embed = new EmbedBuilder()
		.setTitle('Balance')
		.setAuthor(authorDefault(user))
		.setColor(randomColor)
		.setDescription(
			`You've collected ${collected.toFixed(
				3
			)} Random-Bucks and now your current balance is ${collectionHandler.money.toFixed(3)} Random-Bucks.`
		);
	await client.api.interactions.updateMessage(reply, {
		embeds: [embed.toJSON()],
		components: components.map((c) => c.toJSON())
	});
}

export async function upgrade(
	client: Client,
	reply: FastifyReply,
	interaction: APIMessageComponentButtonInteraction,
	components: ActionRowBuilder<MessageActionRowComponentBuilder>[]
) {
	await client.api.interactions.deferMessageUpdate(reply);
	const user = interaction.member?.user;

	let upgradeHandler = await client.db.game.findUnique({ where: { player: user?.id } });
	if (!upgradeHandler)
		return client.api.interactions.reply(reply, {
			content: 'You do not have a game yet.',
			flags: MessageFlags.Ephemeral
		});
	const previousLevel = upgradeHandler.level;
	let costSubtraction = await currentPrice(client, upgradeHandler);
	if (upgradeHandler.money < costSubtraction)
		return client.api.interactions.editReply(interaction, {
			embeds: [
				new EmbedBuilder()
					.setTitle('Not Enough Random-Bucks')
					.setAuthor(authorDefault(user))
					.setColor(randomColor)
					.setDescription(
						[
							`**Current Balance:** ${upgradeHandler.money.toFixed(3)} Random-Bucks`,
							`**Upgrade Cost:** ${costSubtraction.toFixed(3)} Random-Bucks`,
							`**How much more required:** ${(costSubtraction - upgradeHandler.money).toFixed(3)} Random-Bucks`
						].join('\n')
					)
					.toJSON()
			],
			components: components.map((c) => c.toJSON())
		});

	while (upgradeHandler.money > costSubtraction) {
		costSubtraction = await currentPrice(client, upgradeHandler);
		upgradeHandler = await client.db.game.update({
			where: {
				player: user?.id
			},
			data: {
				money: {
					decrement: costSubtraction
				},
				level: {
					increment: 1
				},
				profitRate: {
					multiply: Math.random() * 0.05 + 1.05
				}
			}
		});
	}

	const embed = new EmbedBuilder()
		.setTitle('Upgrade Stats')
		.setAuthor(authorDefault(user))
		.setColor(randomColor)
		.setDescription(
			`You have successfully upgrade from level ${previousLevel} => ${
				upgradeHandler.level
			}.\n\nYour current balance is ${upgradeHandler.money.toFixed(
				3
			)} Random-Bucks.\n\nYour current profit is ${upgradeHandler.profitRate.toFixed(3)} Random-Bucks/sec.`
		)
		.setFooter({
			text: 'Upgrades will raise your rank in the leaderboard within /game.'
		});
	await client.api.interactions.editReply(interaction, {
		embeds: [embed.toJSON()],
		components: components.map((c) => c.toJSON())
	});
}

export async function leaderboard(
	client: Client,
	reply: FastifyReply,
	interaction: APIMessageComponentButtonInteraction,
	components: ActionRowBuilder<MessageActionRowComponentBuilder>[]
) {
	const user = interaction.member?.user;
	let leaderboard = (
		await client.db.game.findMany({
			take: 20,
			orderBy: {
				level: 'desc'
			}
		})
	).reduce((acc, cur, index) => `${acc}\n${index + 1}. <@${cur.player}> - level ${cur.level}`, '');
	if (!leaderboard) leaderboard = 'There is currently no one who has upgraded their income.';
	const embed = new EmbedBuilder()
		.setTitle("Semblance's idle-game leaderboard")
		.setAuthor(authorDefault(user))
		.setColor(randomColor)
		.setDescription(`${leaderboard}`)
		.setFooter({ text: 'May the odds be with you.' });
	await client.api.interactions.updateMessage(reply, {
		embeds: [embed.toJSON()],
		components: components.map((c) => c.toJSON())
	});
}

export async function votes(
	client: Client,
	reply: FastifyReply,
	interaction: APIMessageComponentButtonInteraction,
	components: ActionRowBuilder<MessageActionRowComponentBuilder>[]
) {
	const embed = new EmbedBuilder()
		.setTitle('Vote')
		.setColor(randomColor)
		.setThumbnail(avatarUrl(client.user))
		.setDescription(
			[
				'**Rewardable voting sites**',
				`[Top.gg](https://top.gg/bot/${client.user.id})`,
				'[Discordbotlist.com](https://discordbotlist.com/bots/semblance)',
				'**Unvotable sites**',
				`[Discord.bots.gg](https://discord.bots.gg/bots/${client.user.id})`
			].join('\n')
		);
	return client.api.interactions.updateMessage(reply, {
		embeds: [embed.toJSON()],
		components: components.map((c) => c.toJSON())
	});
}

export async function stats(
	client: Client,
	reply: FastifyReply,
	interaction: APIMessageComponentButtonInteraction,
	components: ActionRowBuilder<MessageActionRowComponentBuilder>[],
	game: Game
) {
	const user = interaction.member?.user;
	const embed = new EmbedBuilder()
		.setTitle("Welcome back to Semblance's Idle-Game!")
		.setAuthor(authorDefault(user))
		.setColor(randomColor)
		.setThumbnail(avatarUrl(user))
		.addFields(
			{ name: 'Level', value: game.level.toString() },
			{ name: 'Random-Bucks', value: game.money.toFixed(3).toString() },
			{ name: 'Percent Increase', value: game.percentIncrease.toString() },
			{
				name: 'Next Upgrade Cost',
				value: (await currentPrice(client, game)).toFixed(3).toString()
			},
			{ name: 'Idle Profit', value: game.profitRate.toFixed(3).toString() }
		)
		.setFooter({ text: 'Remember to vote for Semblance to gain a production boost!' });
	await client.api.interactions.updateMessage(reply, {
		embeds: [embed.toJSON()],
		components: components.map((c) => c.toJSON())
	});
}
