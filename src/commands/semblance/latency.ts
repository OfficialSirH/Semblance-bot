import { type Message, MessageEmbed } from 'discord.js';
import { randomColor, msToTime, Category } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Latency extends Command {
  public override name = 'latency';
  public override description = 'Gets the latency of the bot.';
  public override fullCategory = [Category.semblance];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const { client } = builder;
    const uptime = Date.now() - client.readyTimestamp,
      duration = msToTime(uptime),
      responseTime = Date.now() - builder.createdTimestamp,
      userAvatar = user.displayAvatarURL(),
      embed = new MessageEmbed()
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

  public async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
