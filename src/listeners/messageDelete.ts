import { bugChannels, correctReportList } from '#constants/index';
import { c2sGuildId } from '#config';
import { promisify } from 'util';
import { Events, Listener } from '@sapphire/framework';
import type { Message, PartialMessage } from 'discord.js';
const wait = promisify(setTimeout);

export default class MessageDelete extends Listener<typeof Events.MessageDelete> {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.GuildCreate,
    });
  }

  public override async run(message: Message | PartialMessage) {
    if (
      message.guild?.id != c2sGuildId ??
      (message.channel.id != bugChannels.queue && message.channel.id != bugChannels.approved)
    )
      return;
    await wait(3000);
    const report = await message.client.db.report.findFirst({
      where: {
        messageId: message.id,
      },
    });
    if (report) correctReportList(message.client, message, message.id);
  }
}
