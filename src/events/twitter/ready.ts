import type { TwitterJSEventHandler } from "@semblance/lib/interfaces/Semblance";
import type { Client } from "twitter.js";
import { ClientEvents } from 'twitter.js';


export default {
    name: ClientEvents.READY,
    once: true,
    exec: ({ twClient }) => ready(twClient)
} as TwitterJSEventHandler;

export const ready = async (twClient: Client) => {
    await twClient.filteredTweets.addRules([{ value: 'from:ComputerLunch' }]);
}