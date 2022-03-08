import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';

export class OwnerOnly extends Precondition {
  public override messageRun(message: Message) {
    return ['506458497718812674', '780995336293711875'].includes(message.author.id)
      ? this.ok()
      : this.error({ message: 'Only the bot owner can use this command!' });
  }

  public override chatInputRun(interaction: CommandInteraction<'cached'>) {
    return ['506458497718812674', '780995336293711875'].includes(interaction.user.id)
      ? this.ok()
      : this.error({ message: 'Only the bot owner can use this command!' });
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    OwnerOnly: never;
  }
}
