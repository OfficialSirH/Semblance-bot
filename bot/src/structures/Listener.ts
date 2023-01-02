import type { Awaitable } from '@sapphire/framework';
import type { Client } from './Client';
import type { GatewayDispatchEvents, GatewayDispatchPayload } from '@discordjs/core';

export class Listener<DispatchType extends GatewayDispatchEvents = GatewayDispatchEvents> {
  public readonly event: DispatchType;

  public constructor(public readonly client: Listener.Requirement, options: { event: DispatchType }) {
    this.event = options.event;
  }

  /**
   * run method for event handler
   * @param args the arguments that the event handler passes to the event
   * @example
   * ```typescript
   * public override async run(data: GatewayGuildCreateDispatchData) {
   * console.log(`Hello, world! A new guild with the id of ${data.id} has been created!`);
   * }
   * ```
   */
  public run?(data: (GatewayDispatchPayload & { t: DispatchType })['d']): Awaitable<void>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Listener {
  export type Requirement = Client;
}
