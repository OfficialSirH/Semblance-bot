import type { ComponentHandler } from '#lib/interfaces/Semblance';
import { ActionRow, type InteractionReplyOptions } from 'discord.js';
import { disableAllComponents } from '#constants/index';
import { backButton, closeButton } from '#src/constants/components';
// TODO: rewrite this to use an interaction-handler that takes both button and select menu types
export default {
  selectHandle: async (interaction, { id }, { client }) => {
    if (interaction.user.id != id) return;
    const query = interaction.values[0];

    disableAllComponents(interaction);

    if (!client.stores.get('infoBuilders').has(query))
      return interaction.reply({ content: 'Invalid query.', ephemeral: true });
    const info = await client.stores.get('infoBuilders').get(query).build(interaction);
    if (typeof info == 'string') return interaction.reply({ content: info });
    interaction.reply(info);
  },
  buttonHandle: async (interaction, { action, id }) => {
    const client = interaction.client;
    const components = [new ActionRow()];
    if (action != 'help') components.at(0).components.push(backButton('help', id, 'help'), closeButton('help', id));
    else components.at(0).components.push(closeButton('help', id));

    let data: string | InteractionReplyOptions;
    switch (action) {
      // Main Help Page
      case 'c2shelp':
        data = await client.stores.get('infoBuilders').get('c2shelp').build(interaction);
        break;
      case 'calchelp':
        data = await client.stores.get('infoBuilders').get('calchelp').build(interaction);
        break;
      case 'mischelp':
        data = await client.stores.get('infoBuilders').get('mischelp').build(interaction);
        break;
      // Cell to Singularity Help Page
      case 'metabits':
        data = await client.stores.get('infoBuilders').get('metabits').build(interaction);
        break;
      case 'mesoguide':
        data = await client.stores.get('infoBuilders').get('mesoguide').build(interaction);
        break;
      // Calculator Help Page
      case 'largenumbers':
        data = await client.stores.get('infoBuilders').get('largenumbers').build(interaction);
        break;
      case 'metahelp':
        data = await client.stores.get('infoBuilders').get('metahelp').build(interaction);
        break;
      case 'itemhelp':
        data = await client.stores.get('infoBuilders').get('itemhelp').build(interaction);
        break;
      // Back and Close Actions
      case 'help':
        data = await client.stores.get('infoBuilders').get('help').build(interaction);
        break;
      case 'close':
        return interaction.channel.messages.delete(interaction.message.id);
      default:
        return interaction.reply({ content: 'Invalid action.', ephemeral: true });
    }
    if (typeof data != 'string') {
      if (data.components) data.components.at(0).components.concat(components.at(0).components);
      else data.components = components;
    }
    return interaction.reply(data);
  },
} as ComponentHandler;
