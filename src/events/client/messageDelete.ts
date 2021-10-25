import { bugChannels, correctReportList } from '#constants/index';
import { Report } from '#models/Report';
import config from '#config';
import { promisify } from 'util';
import type { Semblance } from '#structures/Semblance';
import { Constants } from 'discord.js';
import type { Message } from 'discord.js';
const { Events } = Constants;
const { c2sGuildId } = config;
const wait = promisify(setTimeout);

export default {
  name: Events.MESSAGE_DELETE,
  exec: (message: Message, client: Semblance) => messageDelete(message, client),
};

export const messageDelete = async (message: Message, client: Semblance) => {
  if (
    message.guild.id != c2sGuildId ??
    (message.channel.id != bugChannels.queue && message.channel.id != bugChannels.approved)
  )
    return;
  await wait(3000);
  let report = await Report.findOne({ messageId: message.id });
  if (report) correctReportList(client, message, message.id);
};
