import { UserId } from '#constants/index';
import { Precondition } from '@sapphire/framework';
export class OwnerOnly extends Precondition {
  public override chatInputRun(interaction: { user: { id: UserId } }) {
    return [UserId.aditya, UserId.sirh].includes(interaction.user.id as UserId)
      ? this.ok()
      : this.error({ message: 'Only the bot owner can use this command!' });
  }

  public override contextMenuRun(interaction: { user: { id: UserId } }) {
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
