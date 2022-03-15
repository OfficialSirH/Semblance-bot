import { Events, Listener } from '@sapphire/framework';

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
