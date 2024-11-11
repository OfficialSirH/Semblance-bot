import { Category, GuildId, PreconditionName } from '#lib/utilities/index';
import { EmbedBuilder } from '@discordjs/builders';
import {
	ApplicationCommandOptionType,
	PermissionFlagsBits,
	type APIChatInputApplicationCommandGuildInteraction,
	type RESTPostAPIApplicationCommandsJSONBody
} from '@discordjs/core';
import { exec } from 'child_process';
import type { FastifyReply } from 'fastify';

export default class Exec extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'exec',
			description: 'Executes a command in the terminal.',
			fullCategory: [Category.developer],
			preconditions: [PreconditionName.OwnerOnly]
		});
	}

	public override async chatInputRun(
		res: FastifyReply,
		interaction: APIChatInputApplicationCommandGuildInteraction,
		options: InteractionOptionResolver
	) {
		await this.client.api.interactions.deferReply(res);
		const embed = new EmbedBuilder();
		exec(options.getString('input', true), (error, stdout, stderr) => {
			if (error) embed.setDescription(`\`\`\`js\n${error}\`\`\``);
			if (stderr) embed.setDescription(`\`\`\`js\n${stderr}\`\`\``);
			else embed.setDescription(`\`\`\`ansi\n${stdout}\`\`\``);
			return this.client.api.interactions.editReply(interaction, { embeds: [embed.toJSON()] });
		});
	}

	public override data() {
		return {
			command: {
				name: this.name,
				description: this.description,
				default_member_permissions: PermissionFlagsBits.Administrator.toString(),
				options: [
					{
						name: 'input',
						description: 'The command to execute.',
						type: ApplicationCommandOptionType.String,
						required: true
					}
				]
			} satisfies RESTPostAPIApplicationCommandsJSONBody,
			guildIds: [GuildId.cellToSingularity]
		};
	}
}
