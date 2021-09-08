import type { Semblance } from '@semblance/structures';
import { Game } from '@semblance/models';

export const playerUpdate = async (client: Semblance) => { 
    Game.on('playerUpdate', player => {
        client.gameLeaderboard.update(player);
    });
}