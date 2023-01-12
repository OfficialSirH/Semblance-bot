import { Category, randomColor } from '#constants/index';
import { Command } from '#structures/Command';

export default class Vote extends Command {
  public override name = 'vote';
  public override description = 'Lists websites where you can vote for Semblance.';
  public override category = [Category.semblance];

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const { client } = interaction;
    const embed = new EmbedBuilder()
      .setTitle('Vote')
      .setColor(randomColor)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(
        [
          '**Rewardable voting sites**',
          `[Top.gg](https://top.gg/bot/${client.user.id})`,
          '[Discordbotlist.com](https://discordbotlist.com/bots/semblance)',
          '**Unvotable sites**',
          `[Discord.bots.gg](https://discord.bots.gg/bots/${client.user.id})`,
        ].join('\n'),
      ); // Old Semblance Id: 668688939888148480

    return { embeds: [embed] };
  }
}
