import { getPermissionLevel } from '#constants/index';
import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';

export class ModOnly extends Precondition {
  public override messageRun(message: Message) {
    return getPermissionLevel(message.member) > 0
      ? this.ok()
      : this.error({ message: 'Only the bot owner can use this command!' });
  }

  public override chatInputRun(interaction: CommandInteraction<'cached'>) {
    return getPermissionLevel(interaction.member) > 0
      ? this.ok()
      : this.error({ message: 'Only the bot owner can use this command!' });
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    ModOnly: never;
  }
}
