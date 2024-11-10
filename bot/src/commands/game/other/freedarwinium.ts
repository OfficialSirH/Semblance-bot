import { Category } from '#constants/index';
import { Command } from '#structures/Command';
import { EmbedBuilder } from '@discordjs/builders';
import { MessageFlags } from '@discordjs/core';
export default class Freedarwinium extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'freedarwinium',
			description: 'Get free Darwinium.',
			fullCategory: [Category.secret]
		});
	}

	public override templateRun() {
		const embed = new EmbedBuilder().setTitle('Secret').setURL('https://rb.gy/enaq3a');
		return { embeds: [embed.toJSON()], flags: MessageFlags.Ephemeral };
	}
}
