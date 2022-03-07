import { Listener } from '@sapphire/framework';
import { Events } from 'discord.js';

export default class InteractionCreate extends Listener<typeof Events.InteractionCreate> {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      name: Events.InteractionCreate,
    });
  }

  public override async run() {
    // TODO: implement modal interactions here until Sapphire implements modal handling
  }
}
