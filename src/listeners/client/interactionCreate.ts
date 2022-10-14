import type { CustomIdData } from '#lib/interfaces/Semblance';
import { Events, Listener } from '@sapphire/framework';
import type { Interaction } from 'discord.js';

export default class InteractionCreate extends Listener<typeof Events.InteractionCreate> {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      name: Events.InteractionCreate,
    });
  }

  public override async run(interaction: Interaction) {
    if (!interaction.isModalSubmit()) return;
    const parsedCustomId: CustomIdData = JSON.parse(interaction.customId);
    this.container.stores.get('commands').get(parsedCustomId.command)?.modalRun(interaction);
  }
}
