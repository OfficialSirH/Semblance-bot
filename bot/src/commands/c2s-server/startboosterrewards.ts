import { Category, GuildId } from '#constants/index';
import { boosterRoleId, createBoosterRewards } from '#constants/models';
import { Command } from '#structures/Command';
import { MessageFlags, type APIChatInputApplicationCommandGuildInteraction } from '@discordjs/core';
import type { FastifyReply } from 'fastify';

export default class StartBoosterRewards extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'startboosterrewards',
			description: 'Start retrieving booster rewards after you boost the server.',
			fullCategory: [Category.c2sServer]
		});
	}

	public override async chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
		if (!interaction.member?.roles.includes(boosterRoleId))
			return this.client.api.interactions.reply(res, {
				content: 'You need to have the booster role to use this command.',
				flags: MessageFlags.Ephemeral
			});

		return this.client.api.interactions.reply(res, await createBoosterRewards(this.client, interaction.member.user.id));
	}

	public override data() {
		return {
			command: { name: this.name, description: this.description },
			guildIds: [GuildId.cellToSingularity]
		};
	}
}
