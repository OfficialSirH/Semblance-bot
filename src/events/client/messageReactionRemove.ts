import { Semblance } from "@semblance/src/structures";
import { Constants } from 'discord.js';
const { Events } = Constants;

export const messageReactionRemove = (client: Semblance) => {
    client.on(Events.MESSAGE_REACTION_REMOVE, (reaction, user) => {
        if (user.id == client.user.id) return;
    });
}