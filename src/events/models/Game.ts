import type { Semblance } from '#structures/Semblance';
import { Game } from '#models/Game';

export const playerUpdate = async (client: Semblance) => {
  Game.on('playerUpdate', player => {
    client.gameLeaderboard.update(player);
  });
};
