import type { Semblance } from '#structures/Semblance';
import { Votes } from '#models/Votes';

export const userVote = async (client: Semblance) => {
  Votes.on('userVote', user => {
    client.voteLeaderboard.update(user);
  });
};
