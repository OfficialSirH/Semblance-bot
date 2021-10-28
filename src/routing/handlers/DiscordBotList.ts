import { Votes, Game } from '#models/index';
import type { DBLRequest } from '#lib/interfaces/discordBotList';
import type { Semblance } from '#src/structures';
import type { FastifyReply } from 'fastify';
import { VoteHandler } from '#src/structures/VoteHandler';

export class DiscordBotList extends VoteHandler {
  constructor(client: Semblance) {
    super(client, 'discordbotlist.com');
  }

  async handle(request: DBLRequest, reply: FastifyReply): Promise<FastifyReply> {
    const vote = request.body;
    const user = await this.client.users.fetch(vote.id, { cache: false });

    console.log(`${user.tag} just voted!`);
    let playerData = await Game.findOne({ player: vote.id });

    if (playerData)
      playerData = await Game.findOneAndUpdate(
        { player: vote.id },
        { $set: { money: playerData.money + playerData.idleProfit * (3600 * 6) } },
        { new: true },
      );

    this.sendVotedEmbed(user ?? vote.id, `Thanks for voting for Semblance on ${this.votingSite}!! :D`, {
      hasGame: !!playerData,
    });

    let votingUser = await Votes.findOne({ user: user.id });
    if (votingUser)
      votingUser = await Votes.findOneAndUpdate(
        { user: user.id },
        { $set: { voteCount: votingUser.voteCount + 1 } },
        { new: true },
      );
    else {
      votingUser = new Votes({ user: user.id });
      await votingUser.save();
    }
    Votes.emit('userVote', votingUser);

    return reply.code(200).send({ success: true });
  }
}
