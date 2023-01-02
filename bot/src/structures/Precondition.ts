import type { Awaitable } from '#lib/interfaces/Semblance';
import type { APIChatInputApplicationCommandInteraction, APIContextMenuInteraction } from '@discordjs/core';
import type { Client } from './Client';

export class Precondition {
  public readonly name: string;

  public constructor(public readonly client: Precondition.Requirement, options: { name: string }) {
    this.name = options.name;
  }

  /**
   * chatInputRun method for checking if a slash command meets the precondition
   * @param interaction the interaction that triggered the command
   * @example
   * ```typescript
   * public override async chatInputRun(interaction: APIChatInputApplicationCommandInteraction) {
   *  return interaction.data.options[0].value === 'hello world';
   * }
   * ```
   * @returns true if the precondition is met, false if not
   */
  public chatInputRun?(interaction: APIChatInputApplicationCommandInteraction): Awaitable<boolean>;

  /**
   * contextMenuRun method for checking if a context menu meets the precondition
   * @param interaction the interaction that triggered the command
   * @example
   * ```typescript
   * public override async contextMenuRun(interaction: APIContextMenuInteraction) {
   *  return interaction.data.target_id === '1234567890';
   * }
   * ```
   * @returns true if the precondition is met, false if not
   */
  public contextMenuRun?(interaction: APIContextMenuInteraction): Awaitable<boolean>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Precondition {
  export type Requirement = Client;
}
