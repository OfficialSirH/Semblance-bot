import { UserId } from '#constants/index';
import { Precondition } from '@sapphire/framework';
import type { ChatInputCommandInteraction, ContextMenuCommandInteraction } from 'discord.js';

export class OwnerOnly extends Precondition {
  public override chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    return [UserId.aditya, UserId.sirh].includes(interaction.user.id as UserId)
      ? this.ok()
      : this.error({ message: 'Only the bot owner can use this command!' });
  }

  public override contextMenuRun(interaction: ContextMenuCommandInteraction<'cached'>) {
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