import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class OwnerOnlyPrecondition extends Precondition {
  public run(message: Message) {
    return ['506458497718812674', '780995336293711875'].includes(message.author.id)
      ? this.ok()
      : this.error({ message: 'Only the bot owner can use this command!' });
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    OwnerOnly: never;
  }
}
