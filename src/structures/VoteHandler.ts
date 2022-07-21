import type { TextChannel } from 'discord.js';
import type { SapphireClient } from '@sapphire/framework';
import { MessageEmbed, User } from 'discord.js';
import { sirhGuildId } from '#config';
import { randomColor } from '#constants/index';
import type { FastifyReply } from 'fastify';
import type { DBLRequest } from '#lib/interfaces/discordBotList';
import type { DiscordsRequest } from '#lib/interfaces/discords';
import type { TGGRequest } from '#lib/interfaces/topGG';

type AvailableRequests = DBLRequest | DiscordsRequest | TGGRequest;

export class VoteHandler {
  readonly client: SapphireClient;
  readonly votingSite: string;

  constructor(client: SapphireClient, votingSite: string) {
    this.client = client;
    this.votingSite = votingSite;
  }

  get voteChannel() {
    return this.client.guilds.cache
      .get(sirhGuildId)
      .channels.cache.find(c => c.name == 'semblance-votes') as TextChannel;
  }

  public async sendVotedEmbed(
    user: string | User,
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
    const embed = new MessageEmbed().setColor(randomColor).setDescription(description);
    if (user instanceof User)
      embed
        .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL() })
        .setThumbnail(user.displayAvatarURL())
        .setFooter({ text: `${user.tag} has voted.` });
    else embed.setAuthor({ name: `<@${user}>` }).setFooter({ text: `<@${user}> has voted.` });

    return this.voteChannel.send({ embeds: [embed] });
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

    let userId: string;
    if ('user' in vote && typeof vote.user == 'string') userId = vote.user;
    else if (!('user' in vote)) userId = vote.id;

    const user = await this.client.users.fetch(userId, { cache: false });

    console.log(`${user.tag} just voted!`);
    const earningsBonus = 'isWeekend' in vote && vote.isWeekend ? 3600 * 12 : 3600 * 6;
    const playerProfit = await this.client.db.game.findUnique({
      select: {
        profitRate: true,
      },
      where: { player: user.id },
    });

    const playerData = await this.client.db.game
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

    this.sendVotedEmbed(user ?? user.id, `Thanks for voting for Semblance on ${this.votingSite}!! :D`, {
      hasGame: !!playerData,
      weekendBonus: 'isWeekend' in vote ? vote.isWeekend : false,
    });

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
