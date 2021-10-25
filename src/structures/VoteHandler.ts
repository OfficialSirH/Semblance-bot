import type { Snowflake } from 'discord-api-types';
import type { TextChannel } from 'discord.js';
import type { Semblance } from '#structures/Semblance';
import { MessageEmbed, User } from 'discord.js';
import config from '#config';
import { randomColor } from '#constants/index';

export class VoteHandler {
  readonly client: Semblance;
  readonly votingSite: string;

  constructor(_client: Semblance, _votingSite: string) {
    this.client = _client;
    this.votingSite = _votingSite;
  }

  get voteChannel() {
    return this.client.guilds.cache
      .get(config.sirhGuildId)
      .channels.cache.find(c => c.name == 'semblance-votes') as TextChannel;
  }

  public async sendVotedEmbed(
    user: Snowflake | User,
    description: string,
    { hasGame, weekendBonus }: { hasGame?: boolean; weekendBonus?: boolean } = { hasGame: false, weekendBonus: false },
  ) {
    if (weekendBonus)
      description += `\nAs a voting bonus *and* being the weekend, you have earned ***12*** hours of idle profit for Semblance's Idle Game!`;
    else if (hasGame)
      description += `\nAs a voting bonus, you have earned **6** hours of idle profit for Semblance's Idle Game!`;
    const embed = new MessageEmbed().setColor(randomColor).setDescription(description);

    if (user instanceof User)
      embed
        .setAuthor(`${user.tag}`, user.displayAvatarURL())
        .setThumbnail(user.displayAvatarURL())
        .setFooter(`${user.tag} has voted.`);
    else embed.setAuthor(`<@${user}>`).setFooter(`<@${user}> has voted.`);

    return this.voteChannel.send({ embeds: [embed] });
  }
}
