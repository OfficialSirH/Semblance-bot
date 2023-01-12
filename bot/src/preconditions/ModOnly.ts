import { getPermissionLevel } from '#constants/index';
import type { APIApplicationCommandInteraction, APIContextMenuInteraction } from '@discordjs/core';
import { Precondition } from '#structures/Precondition';

export class ModOnly extends Precondition {
  public override chatInputRun(interaction: APIApplicationCommandInteraction) {
    return getPermissionLevel(interaction.member) > 0
      ? this.ok()
      : this.error('Only the moderators can use this command!');
  }

  public override contextMenuRun(interaction: APIContextMenuInteraction) {
    return getPermissionLevel(interaction.member) > 0
      ? this.ok()
      : this.error('Only the moderators can use this command!');
  }
}
