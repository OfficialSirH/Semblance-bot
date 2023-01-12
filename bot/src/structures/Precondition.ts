import type { Awaitable, Result } from '#lib/interfaces/Semblance';
import type { APIChatInputApplicationCommandInteraction, APIContextMenuInteraction } from '@discordjs/core';
import type { Client } from './Client';

export class Precondition {
  public readonly name: string;

  public constructor(public readonly client: Precondition.Requirement, options: { name: string }) {
    this.name = options.name;
  }

  /**
   * method for checking if a slash command meets the precondition
   * @param interaction the interaction that triggered the command
   * @example
   * ```typescript
   * public override async chatInputRun(interaction: APIChatInputApplicationCommandInteraction) {
   *  return interaction.data.options[0].value === 'hello world';
   * }
   * ```
   * @returns true if the precondition is met, false if not
   */
  public chatInputRun?(interaction: APIChatInputApplicationCommandInteraction): Awaitable<Result>;

  /**
   * method for checking if a context menu meets the precondition
   * @param interaction the interaction that triggered the command
   * @example
   * ```typescript
   * public override async contextMenuRun(interaction: APIContextMenuInteraction) {
   *  return interaction.data.target_id === '1234567890';
   * }
   * ```
   * @returns true if the precondition is met, false if not
   */
  public contextMenuRun?(interaction: APIContextMenuInteraction): Awaitable<Result>;

  /**
   * method for declaring a precondition as ok
   * @example
   * ```typescript
   * public override async chatInputRun(interaction: APIChatInputApplicationCommandInteraction) {
   *  return this.ok();
   * }
   * ```
   * @returns Result with ok set to true
   */
  public ok(): Result<true> {
    return { ok: true };
  }

  /**
   * method for declaring a precondition as not ok
   * @param message the message to be returned to the user
   * @example
   * ```typescript
   * public override async chatInputRun(interaction: APIChatInputApplicationCommandInteraction) {
   *  return this.error({ message: 'You do not have permission to use this command!' });
   * }
   * ```
   * @returns Result with ok set to false and message set to the message passed in
   */
  public error(message: string): Result<false> {
    return { ok: false, message };
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Precondition {
  export type Requirement = Client;
}
