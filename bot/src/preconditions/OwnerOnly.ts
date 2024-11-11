import { PreconditionName, UserId } from '#lib/utilities/index';
import type { APIChatInputApplicationCommandInteraction, APIContextMenuInteraction } from '@discordjs/core';
export default class OwnerOnly extends Precondition {
	public constructor(client: Precondition.Requirement) {
		super(client, { name: PreconditionName.OwnerOnly });
	}

	public override chatInputRun(interaction: APIChatInputApplicationCommandInteraction) {
		return [UserId.aditya, UserId.sirh].includes(interaction.member?.user.id as UserId)
			? this.ok()
			: this.error('Only the bot owner can use this command!');
	}

	public override contextMenuRun(interaction: APIContextMenuInteraction) {
		return [UserId.aditya, UserId.sirh].includes(interaction.member?.user.id as UserId)
			? this.ok()
			: this.error('Only the bot owner can use this command!');
	}
}
