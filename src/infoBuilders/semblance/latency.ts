import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { msToTime, randomColor } from '#constants/index';
import { Embed } from 'discord.js';

export default class Latency extends InfoBuilder {
  public override name = 'latency';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build(builder: InfoBuilder['BuildOption']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const { client } = builder;
    const uptime = Date.now() - client.readyTimestamp,
      duration = msToTime(uptime),
      responseTime = Date.now() - builder.createdTimestamp,
      userAvatar = user.displayAvatarURL(),
      embed = new Embed()
        .setTitle('Latency')
        .setColor(randomColor)
        .setThumbnail(userAvatar)
        .setDescription(
          `**Bot Response Time:** \`${responseTime}ms\`\n **API**: \`${Math.round(
            client.ws.ping,
          )}ms\` \n **Bot Uptime:** \`${duration}\``,
        )
        .setFooter({ text: `Why do this to me ${user.tag}`, iconURL: userAvatar });
    return { embeds: [embed] };
  }
}
