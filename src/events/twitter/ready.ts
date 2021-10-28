import type { TwitterJSEventHandler } from '#lib/interfaces/Semblance';
import type { Client } from 'twitter.js';
import { ClientEvents } from 'twitter.js';

export default {
  name: ClientEvents.READY,
  once: true,
  exec: client => ready(client),
} as TwitterJSEventHandler<'ready'>;

export const ready = async (client: Client) => {
  await client.filteredTweets.addRules([{ value: 'from:ComputerLunch' }]);
};
