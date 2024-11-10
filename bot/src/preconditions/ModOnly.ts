import { PreconditionName, getPermissionLevel } from '#constants/index';
import type { APIChatInputApplicationCommandGuildInteraction, APIContextMenuInteraction } from '@discordjs/core';
import { Precondition } from '#structures/Precondition';

export default class ModOnly extends Precondition {
	public constructor(client: Precondition.Requirement) {
		super(client, { name: PreconditionName.ModOnly });
	}

	public override chatInputRun(interaction: APIChatInputApplicationCommandGuildInteraction) {
		return getPermissionLevel(interaction.member) > 0 ? this.ok() : this.error('Only the moderators can use this command!');
	}

	public override contextMenuRun(interaction: APIContextMenuInteraction) {
		return getPermissionLevel(interaction.member) > 0 ? this.ok() : this.error('Only the moderators can use this command!');
	}
}
