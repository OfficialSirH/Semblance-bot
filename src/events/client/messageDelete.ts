import { bugChannels, correctReportList } from '@semblance/constants';
import { Report } from '@semblance/models';
import config from '@semblance/config';
import { promisify } from 'util';
import { Semblance } from '@semblance/src/structures';
import { Constants } from 'discord.js';
const { Events } = Constants;
const { c2sGuildId } = config;
const wait = promisify(setTimeout);

export const messageDelete = (client: Semblance) => {
    client.on(Events.MESSAGE_DELETE, async message => {
            if (message.guild.id != c2sGuildId ?? 
                (message.channel.id != bugChannels.queue &&
                     message.channel.id != bugChannels.approved)) return;
            await wait(3000);
            let report = await Report.findOne({ messageId: message.id });
            if (report) correctReportList(client, message, message.id);
    });
}