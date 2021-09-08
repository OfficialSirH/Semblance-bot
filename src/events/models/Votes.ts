import type { Semblance } from '@semblance/structures';
import { Votes } from '@semblance/models';

export const userVote = async (client: Semblance) => { 
    Votes.on('userVote', user => {
        client.voteLeaderboard.update(user);
    });
}