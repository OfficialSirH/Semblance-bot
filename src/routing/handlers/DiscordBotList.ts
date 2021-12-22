import type { DBLRequest } from '#lib/interfaces/discordBotList';
import type { Semblance } from '#structures/Semblance';
import type { FastifyReply } from 'fastify';
import { VoteHandler } from '#structures/VoteHandler';

export class DiscordBotList extends VoteHandler {
  constructor(client: Semblance) {
    super(client, 'discordbotlist.com');
  }

  async handle(request: DBLRequest, reply: FastifyReply): Promise<FastifyReply> {
    const vote = request.body;
    const user = await this.client.users.fetch(vote.id, { cache: false });

    console.log(`${user.tag} just voted!`);
    // let playerData = await Game.findOne({ player: vote.user });
    const playerProfit = await this.client.db.game.findUnique({
      select: {
        profitRate: true,
      },
      where: { player: vote.id },
    });

    const playerData = await this.client.db.game
      .update({
        where: {
          player: vote.id,
        },
        data: {
          money: {
            increment: playerProfit.profitRate * 3600 * 6,
          },
        },
      })
      .catch(() => {
        return;
      });

    // if (playerData)
    //   playerData = await Game.findOneAndUpdate(
    //     { player: vote.user },
    //     {
    //       $set: {
    //         money: playerData.money + playerData.idleProfit * earningsBonus,
    //       },
    //     },
    //     { new: true },
    //   );

    this.sendVotedEmbed(user ?? vote.id, `Thanks for voting for Semblance on ${this.votingSite}!! :D`, {
      hasGame: !!playerData,
    });

    // let votingUser = await Votes.findOne({ user: user.id });
    // if (votingUser)
    //   votingUser = await Votes.findOneAndUpdate(
    //     { user: user.id },
    //     { $set: { voteCount: votingUser.voteCount + 1 } },
    //     { new: true },
    //   );
    // else {
    //   votingUser = new Votes({ user: user.id });
    //   await votingUser.save();
    // }
    await this.client.db.vote.upsert({
      where: {
        userId: user.id,
      },
      create: {
        userId: user.id,
      },
      update: {
        voteCount: {
          increment: 1,
        },
      },
    });

    return reply.code(200).send({ success: true });
  }
}
