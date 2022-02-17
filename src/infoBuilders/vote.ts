import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor, prefix } from '#constants/index';
import { Embed } from 'discord.js';

export default class Vote extends InfoBuilder {
  public override name = 'vote';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build(builder: InfoBuilder['BuildOption']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const { client } = builder;
    const embed = new Embed()
      .setTitle('Vote')
      .setColor(randomColor)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(
        [
          '**Rewardable voting sites**',
          `[Top.gg](https://top.gg/bot/${client.user.id})`,
          '[Discordbotlist.com](https://discordbotlist.com/bots/semblance)',
          `[Discords.com](https://discords.com/bots/bot/${client.user.id})`,
          `[Discord.boats](https://discord.boats/bot/${client.user.id})`,
          '**Unrewardable voting sites**',
          `[Botlist.space](https://botlist.space/bot/${client.user.id})`,
          '**Unvotable sites**',
          `[Discord.bots.gg](https://discord.bots.gg/bots/${client.user.id})`,
        ].join('\n'),
      ) // Old Semblance Id: 668688939888148480
      .setFooter({
        text: `Thanks, ${user.tag}, for considering to support my bot through voting, you may also support me with ${prefix}patreon :D`,
        iconURL: user.displayAvatarURL(),
      });
    return { embeds: [embed] };
  }
}
