import { UserId } from '#constants/index';
import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, ContextMenuInteraction, Message } from 'discord.js';

export class OwnerOnly extends Precondition {
  public override messageRun(message: Message) {
    return [UserId.aditya, UserId.sirh].includes(message.author.id as UserId)
      ? this.ok()
      : this.error({ message: 'Only the bot owner can use this command!' });
  }

  public override chatInputRun(interaction: CommandInteraction<'cached'>) {
    return [UserId.aditya, UserId.sirh].includes(interaction.user.id as UserId)
      ? this.ok()
      : this.error({ message: 'Only the bot owner can use this command!' });
  }

  public override contextMenuRun(interaction: ContextMenuInteraction<'cached'>) {
    return [UserId.aditya, UserId.sirh].includes(interaction.user.id as UserId)
      ? this.ok()
      : this.error({ message: 'Only the bot owner can use this command!' });
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    OwnerOnly: never;
  }
}
