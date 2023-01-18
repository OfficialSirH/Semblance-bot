import {
  type ActionRowData,
  type MessageActionRowComponentData,
  ActionRowBuilder,
  type ButtonInteraction,
  type SelectMenuInteraction,
  type InteractionReplyOptions,
  type InteractionUpdateOptions,
  type MessageActionRowComponentBuilder,
} from 'discord.js';
import { disableAllComponents } from '#constants/index';
import { backButton, closeButton, componentInteractionDefaultParser } from '#constants/components';
import type { ParsedCustomIdData } from '#lib/interfaces/Semblance';
import { InteractionHandler, InteractionHandlerTypes, type PieceContext } from '@sapphire/framework';

export default class Help extends InteractionHandler {
  public constructor(context: PieceContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      name: 'help',
      interactionHandlerType: InteractionHandlerTypes.MessageComponent,
    });
  }

  public override parse(
    interaction: ButtonInteraction<'cached'> | SelectMenuInteraction<'cached'>,
  ): ReturnType<typeof componentInteractionDefaultParser> {
    return componentInteractionDefaultParser(this, interaction);
  }

  public override async run(
    interaction: ButtonInteraction<'cached'> | SelectMenuInteraction<'cached'>,
    data: ParsedCustomIdData<
      'c2shelp' | 'mischelp' | 'metabits' | 'mesoguide' | 'largenumbers' | 'metahelp' | 'itemhelp' | 'help' | 'close'
    >,
  ) {
    if (interaction.isButton()) return this.buttonRun(interaction, data);
    if (interaction.isSelectMenu()) return this.selectMenuRun(interaction);
  }

  public async selectMenuRun(interaction: SelectMenuInteraction<'cached'>) {
    const query = interaction.values[0];

    await disableAllComponents(interaction);

    if (!this.client.stores.get('commands').has(query))
      return this.client.api.interactions.reply(res, { content: 'Invalid query.', flags: MessageFlags.Ephemeral });

    // @ts-expect-error - I already checked if the command exists just above, but TS doesn't know that
    const info = await this.client.stores.get('commands').get(query).sharedRun(interaction);

    return this.client.api.interactions.reply(res, info);
  }

  public async buttonRun(
    interaction: ButtonInteraction<'cached'>,
    data: ParsedCustomIdData<
      'c2shelp' | 'mischelp' | 'metabits' | 'mesoguide' | 'largenumbers' | 'metahelp' | 'itemhelp' | 'help' | 'close'
    >,
  ) {
    const client = this.client;
    const components = [new ActionRowBuilder<MessageActionRowComponentBuilder>()];
    if (data.action != 'help')
      components
        .at(0)
        ?.components.push(backButton('help', interaction.user.id, 'help'), closeButton('help', interaction.user.id));

    let options: string | InteractionReplyOptions | undefined;
    switch (data.action) {
      // Main Help Page
      case 'c2shelp':
        // @ts-expect-error - complains about an attempt to invoke a possibly undefined object despite optional chaining
        options = await client.stores.get('commands').get('c2shelp')?.sharedRun(interaction);
        break;
      case 'mischelp':
        // @ts-expect-error - complains about an attempt to invoke a possibly undefined object despite optional chaining
        options = await client.stores.get('commands').get('mischelp')?.sharedRun(interaction);
        break;
      // Cell to Singularity Help Page
      case 'metabits':
        // @ts-expect-error - complains about an attempt to invoke a possibly undefined object despite optional chaining
        options = await client.stores.get('commands').get('metabits')?.sharedRun(interaction);
        break;
      case 'mesoguide':
        // @ts-expect-error - complains about an attempt to invoke a possibly undefined object despite optional chaining
        options = await client.stores.get('commands').get('mesoguide')?.sharedRun(interaction);
        break;
      // Calculator Help Page
      case 'largenumbers':
        // @ts-expect-error - complains about an attempt to invoke a possibly undefined object despite optional chaining
        options = await client.stores.get('commands').get('largenumbers')?.sharedRun(interaction);
        break;
      case 'metahelp':
        // @ts-expect-error - complains about an attempt to invoke a possibly undefined object despite optional chaining
        options = await client.stores.get('commands').get('metahelp')?.sharedRun(interaction);
        break;
      case 'itemhelp':
        // @ts-expect-error - complains about an attempt to invoke a possibly undefined object despite optional chaining
        options = await client.stores.get('commands').get('itemhelp')?.sharedRun(interaction);
        break;
      // Back and Close Actions
      case 'help':
        // @ts-expect-error - complains about an attempt to invoke a possibly undefined object despite optional chaining
        options = await client.stores.get('commands').get('help')?.sharedRun(interaction);
        break;
      case 'close':
        return interaction.channel?.messages.delete(interaction.message.id);
      default:
        return this.client.api.interactions.reply(res, { content: 'Invalid action.', flags: MessageFlags.Ephemeral });
    }

    if (!options)
      return this.client.api.interactions.reply(res, { content: 'Invalid action.', flags: MessageFlags.Ephemeral });
    if (typeof options != 'string') {
      if (options.components)
        (options.components?.at(0) as ActionRowData<MessageActionRowComponentData>).components.push(
          ...(components.at(0) as ActionRowBuilder<MessageActionRowComponentBuilder>).components,
        );
      else options.components = components;
      options.files = [];
    }
    return interaction.update(options as InteractionUpdateOptions);
  }
}
