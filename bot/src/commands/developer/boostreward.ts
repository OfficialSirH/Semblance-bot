import { Category, formattedDate, GuildId, isUserInGuild, PreconditionName } from '#lib/utilities/index';
import {
	ApplicationCommandOptionType,
	MessageFlags,
	PermissionFlagsBits,
	type APIChatInputApplicationCommandGuildInteraction,
	type APIUser,
	type RESTPostAPIApplicationCommandsJSONBody
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';

export default class BoostReward extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'boostreward',
			description: 'interact with booster rewards for users',
			fullCategory: [Category.developer],
			preconditions: [PreconditionName.OwnerOnly]
		});
	}

	public override async chatInputRun(
		res: FastifyReply,
		interaction: APIChatInputApplicationCommandGuildInteraction,
		options: InteractionOptionResolver
	) {
		const subcommand = options.getSubcommand();

		switch (subcommand) {
			case 'add': {
				const user = options.getUser('user');
				if (!user || !(await isUserInGuild(this.client.rest, interaction.guild_id, user)))
					return interaction.reply(res, {
						content: 'invalid user',
						flags: MessageFlags.Ephemeral
					});
				const days = options.getInteger('days') ?? 28;
				return this.addBooster(res, interaction, { user, days });
			}
			case 'edit': {
				const user = options.getUser('user');
				if (!user || !(await isUserInGuild(this.client.rest, interaction.guild_id, user)))
					return interaction.reply(res, {
						content: 'invalid user',
						flags: MessageFlags.Ephemeral
					});
				const days = options.getInteger('days', true);
				return this.editBooster(res, interaction, { user, days });
			}
			case 'remove': {
				const user = options.getUser('user');
				if (!user || !(await isUserInGuild(this.client.rest, interaction.guild_id, user)))
					return interaction.reply(res, {
						content: 'invalid user',
						flags: MessageFlags.Ephemeral
					});
				return this.removeBooster(res, interaction, user);
			}
			case 'list':
				return this.listBoosters(res);
			default:
				return interaction.reply(res, { content: 'Invalid subcommand.' });
		}
	}

	public override data() {
		return {
			command: {
				name: this.name,
				description: this.description,
				default_member_permissions: PermissionFlagsBits.Administrator.toString(),
				options: [
					{
						name: 'add',
						description: 'add a user to the booster reward list',
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: 'user',
								description: 'the user to add to the booster reward list',
								type: ApplicationCommandOptionType.User,
								required: true
							},
							{
								name: 'days',
								description: 'the number of days till the user gets their reward (defaults to 28)',
								type: ApplicationCommandOptionType.Integer
							}
						]
					},
					{
						name: 'edit',
						description: 'edit a user in the booster reward list',
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: 'user',
								description: 'the user to edit in the booster reward list',
								type: ApplicationCommandOptionType.User,
								required: true
							},
							{
								name: 'days',
								description: 'the number of days till the user gets their reward',
								type: ApplicationCommandOptionType.Integer,
								required: true
							}
						]
					},
					{
						name: 'remove',
						description: 'remove a user from the booster reward list',
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: 'user',
								description: 'the user to remove from the booster reward list',
								type: ApplicationCommandOptionType.User,
								required: true
							}
						]
					},
					{
						name: 'list',
						description: 'list all users in the booster reward list',
						type: ApplicationCommandOptionType.Subcommand
					}
				]
			} satisfies RESTPostAPIApplicationCommandsJSONBody,
			guildIds: [GuildId.cellToSingularity]
		};
	}

	public async addBooster(
		res: FastifyReply,
		interaction: APIChatInputApplicationCommandGuildInteraction,
		options: { user: APIUser; days: number }
	) {
		let boosterRewards = await this.client.db.boosterReward.findUnique({ where: { userId: options.user.id } });
		if (boosterRewards)
			return interaction.reply(res, {
				content: `That user is already listed to receive an automated reward on ${formattedDate(boosterRewards.rewardingDate.valueOf())}`
			});

		boosterRewards = await this.client.db.boosterReward.create({
			data: {
				userId: options.user.id,
				rewardingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * options.days)
			}
		});
		await interaction.reply(res, {
			content: `That user will now receive an automated reward on ${formattedDate(boosterRewards.rewardingDate.valueOf())}`
		});
	}

	public async editBooster(
		res: FastifyReply,
		interaction: APIChatInputApplicationCommandGuildInteraction,
		options: { user: APIUser; days: number }
	) {
		let boosterRewards = await this.client.db.boosterReward.findUnique({ where: { userId: options.user.id } });
		if (!boosterRewards)
			return interaction.reply(res, {
				content: 'That user is not listed to receive an automated reward'
			});

		boosterRewards = await this.client.db.boosterReward.update({
			where: {
				userId: options.user.id
			},
			data: {
				rewardingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * options.days)
			}
		});
		await interaction.reply(res, {
			content: `The user's reward was successfully updated, they will now receive an automated reward on ${formattedDate(
				boosterRewards.rewardingDate.valueOf()
			)}`
		});
	}

	public async removeBooster(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction, user: APIUser) {
		const boosterRewards = await this.client.db.boosterReward.delete({ where: { userId: user.id } });
		if (!boosterRewards)
			return interaction.reply(res, {
				content: 'That user is not listed to receive an automated reward'
			});

		await interaction.reply(res, {
			content: 'That user will no longer receive an automated reward'
		});
	}

	public async listBoosters(res: FastifyReply) {
		const boosterRewards = await this.client.db.boosterReward.findMany({});
		if (!boosterRewards.length) return interaction.reply(res, { content: 'There are no booster rewards to list' });

		interaction.reply(res, {
			content: `Here's all ${boosterRewards.length} booster reward users`,
			files: [
				new Attachy(
					Buffer.from(
						`${boosterRewards.reduce((acc, cur) => (acc += `${cur.userId} - ${formattedDate(cur.rewardingDate.valueOf())}\n`), '')}`
					),
					'boosterRewards.js'
				)
			]
		});
	}
}
