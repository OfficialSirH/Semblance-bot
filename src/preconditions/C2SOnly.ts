import { GuildId } from '#constants/index';
import { Precondition } from '@sapphire/framework';
import type { ChatInputCommandInteraction, ContextMenuCommandInteraction, Message } from 'discord.js';

export class OwnerOnly extends Precondition {
  public override messageRun(message: Message) {
    return message.guild.id == GuildId.cellToSingularity ? this.ok() : this.error();
  }

  public override chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    return interaction.guild.id == GuildId.cellToSingularity ? this.ok() : this.error();
  }

  public override contextMenuRun(interaction: ContextMenuCommandInteraction<'cached'>) {
    return interaction.guild.id == GuildId.cellToSingularity ? this.ok() : this.error();
  }
}

declare module '@sapphire/framework' {
  interface Preconditions {
    C2SOnly: never;
  }
}
