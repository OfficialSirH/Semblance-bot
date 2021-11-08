import { bugChannels, correctReportList } from '#constants/index';
import { Report } from '#models/Report';
import { c2sGuildId } from '#config';
import { promisify } from 'util';
import type { Semblance } from '#structures/Semblance';
import { Constants } from 'discord.js';
import type { Message, PartialMessage } from 'discord.js';
import type { EventHandler } from '#lib/interfaces/Semblance';
const { Events } = Constants;
const wait = promisify(setTimeout);

export default {
  name: Events.MESSAGE_DELETE,
  exec: (message, client) => messageDelete(message, client),
} as EventHandler<'messageDelete'>;

export const messageDelete = async (message: Message | PartialMessage, client: Semblance) => {
  if (
    message.guild?.id != c2sGuildId ??
    (message.channel.id != bugChannels.queue && message.channel.id != bugChannels.approved)
  )
    return;
  await wait(3000);
  const report = await Report.findOne({ messageId: message.id });
  if (report) correctReportList(client, message, message.id);
};
