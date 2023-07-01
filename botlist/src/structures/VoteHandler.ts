import type { FastifyReply } from 'fastify';
import type { DBLRequest } from '../interfaces/discordBotList.js';
import type { TGGRequest } from '../interfaces/topGG.js';
import type { REST } from '@discordjs/rest';
import { type APIEmbed, type APIUser, Routes } from 'discord-api-types/v10';
import { voteChannel } from '../constants.js';

type AvailableRequests = DBLRequest | TGGRequest;

export class VoteHandler {
  constructor(readonly rest: REST, readonly votingSite: string) {}

  public async sendVotedEmbed(
    user: string | APIUser,
    description: string,
    { hasGame, weekendBonus }: { hasGame: boolean; weekendBonus?: boolean } = {
      hasGame: false,
      weekendBonus: false,
    },
  ) {
    if (hasGame) {
      if (weekendBonus)
        description +=
          "\nAs a voting bonus *and* being the weekend, you have earned ***12*** hours of idle profit for Semblance's Idle Game!";
      else description += "\nAs a voting bonus, you have earned **6** hours of idle profit for Semblance's Idle Game!";
    }

    let embed: APIEmbed = {
      description,
    };
    if (typeof user == 'string')
      embed = {
        ...embed,
        author: { name: `<@${user}>` },
        footer: {
          text: `user of id ${user} has voted.`,
        },
      };
    else
      embed = {
        ...embed,
        author: {
          name: `${user.username}#${user.discriminator}`,
          icon_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${
            user.avatar?.startsWith('a_') ? 'gif' : 'png'
          }`,
        },
        thumbnail: {
          url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${
            user.avatar?.startsWith('a_') ? 'gif' : 'png'
          }`,
        },
        footer: {
          text: `${user.username}#${user.discriminator} has voted.`,
        },
      };

    return this.rest.post(Routes.channelMessages(voteChannel), { body: { embeds: [embed] } });
  }

  public async handle(request: AvailableRequests, reply: FastifyReply): Promise<FastifyReply> {
    const vote = request.body;
    if ('type' in vote && vote.type === 'test') {
      console.log('Test vote received');
      return reply.code(200).send({
        success: true,
        message: 'Test vote received',
      });
    }

    let userId: string | null = null;
    if ('user' in vote && typeof vote.user == 'string') userId = vote.user;
    else if (!('user' in vote)) userId = vote.id;

    if (!userId) {
      this.rest.logger.error('VoteHandler', `No user id found in ${this.votingSite} vote.`);
      return reply.code(200).send({
        success: false,
        message: 'No user id found',
      });
    }

    const user = (await this.rest.get(Routes.user(userId))) as APIUser;

    console.log(`${user.username}#${user.discriminator} just voted!`);
    const earningsBonus = 'isWeekend' in vote && vote.isWeekend ? 3600 * 12 : 3600 * 6;
    const playerProfit = await this.rest.db.game.findUnique({
      select: {
        profitRate: true,
      },
      where: { player: user.id },
    });

    if (!playerProfit) return reply.code(200).send({ success: true });

    const playerData = await this.rest.db.game
      .update({
        where: {
          player: user.id,
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

    this.sendVotedEmbed(user.id, `Thanks for voting for Semblance on ${this.votingSite}!! :D`, {
      hasGame: !!playerData,
      weekendBonus: 'isWeekend' in vote ? vote.isWeekend : false,
    });

    await this.rest.db.vote.upsert({
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
