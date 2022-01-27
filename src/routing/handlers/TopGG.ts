import type { TGGRequest } from '#lib/interfaces/topGG';
import type { Semblance } from '#structures/Semblance';
import type { FastifyReply } from 'fastify';
import { VoteHandler } from '#structures/VoteHandler';

export class TopGG extends VoteHandler {
  constructor(client: Semblance) {
    super(client, 'discords.com');
  }

  async handle(request: TGGRequest, reply: FastifyReply): Promise<FastifyReply> {
    const vote = request.body;
    if (vote.type === 'test') {
      console.log('Test vote received');
      return reply.code(200).send({
        success: true,
        message: 'Test vote received',
      });
    }
    const user = await this.client.users.fetch(vote.user, { cache: false });

    console.log(`${user.tag} just voted!`);
    // let playerData = await Game.findOne({ player: vote.user });
    const earningsBonus = vote.isWeekend ? 3600 * 12 : 3600 * 6;
    const playerProfit = await this.client.db.game.findUnique({
      select: {
        profitRate: true,
      },
      where: { player: vote.user },
    });

    const playerData = await this.client.db.game
      .update({
        where: {
          player: vote.user,
        },
        data: {
          money: {
            increment: playerProfit.profitRate * earningsBonus,
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

    this.sendVotedEmbed(user ?? vote.user, `Thanks for voting for Semblance on ${this.votingSite}!! :D`, {
      hasGame: !!playerData,
      weekendBonus: vote.isWeekend,
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
