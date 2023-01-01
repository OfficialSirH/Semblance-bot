import type { Awaitable } from '@sapphire/framework';
import type { Client } from './Client';
import type { GatewayDispatchEvents } from '@discordjs/core';

export class Event {
  public readonly name: GatewayDispatchEvents;

  public constructor(public readonly client: Event.Requirement, options: { name: GatewayDispatchEvents }) {
    this.name = options.name;
  }

  /**
   * run method for event handler
   * @param args the arguments that the event handler passes to the event
   * @example
   * ```typescript
   * public override async run(...args: unknown[]) {
   * console.log('Hello, world!');
   * }
   * ```
   */
  public run?(...args: unknown[]): Awaitable<void>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Event {
  export type Requirement = Client;
}
