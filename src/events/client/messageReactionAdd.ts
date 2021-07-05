import { Semblance } from '@semblance/src/structures';
import { Constants } from 'discord.js';
const { Events } = Constants;

export const messageReactionAdd = (client: Semblance) => {
    client.on(Events.MESSAGE_REACTION_ADD, (reaction, user) => {
        if(user.id == client.user.id) return;
    });
}