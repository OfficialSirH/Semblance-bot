import { turnPage } from '@semblance/constants';
import { Semblance } from '@semblance/src/structures';
import { User } from 'discord.js';

export const messageReactionAdd = (client: Semblance) => {
    client.on("messageReactionAdd", (reaction, user) => {
        if(user.id == client.user.id) return; 
        turnPage(reaction, user);
    });
}