import { type Message, Embed } from 'discord.js';
import { Categories, prefix, randomColor } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Vote extends Command {
  public override name = 'vote';
  public override description = 'Lists websites where you can vote for Semblance.';
  public override fullCategory = [Categories.semblance];

  public override sharedRun(builder: Command['SharedBuilder']) {
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

  public async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
