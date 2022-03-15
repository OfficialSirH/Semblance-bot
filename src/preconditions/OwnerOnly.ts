import { adityaId, sirhId } from '#config';
import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, ContextMenuInteraction, Message } from 'discord.js';

export class OwnerOnly extends Precondition {
  public override messageRun(message: Message) {
    return [adityaId, sirhId].includes(message.author.id)
      ? this.ok()
      : this.error({ message: 'Only the bot owner can use this command!' });
  }

  public override chatInputRun(interaction: CommandInteraction<'cached'>) {
    return [adityaId, sirhId].includes(interaction.user.id)
      ? this.ok()
      : this.error({ message: 'Only the bot owner can use this command!' });
  }

  public override contextMenuRun(interaction: ContextMenuInteraction<'cached'>) {
    return [adityaId, sirhId].includes(interaction.user.id)
      ? this.ok()
      : this.error({ message: 'Only the bot owner can use this command!' });
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    OwnerOnly: never;
  }
}
