import { bugChannels, correctReportList } from '@semblance/constants';
import { Report } from '@semblance/models';
import config from '@semblance/config';
import { promisify } from 'util';
import { Semblance } from '@semblance/src/structures';
const { c2sGuildID } = config;
const wait = promisify(setTimeout);

export const messageDelete = (client: Semblance) => {
    client.on("messageDelete", async message => {
            if (message.guild.id != c2sGuildID ?? 
                (message.channel.id != bugChannels.queue &&
                     message.channel.id != bugChannels.approved)) return;
            await wait(3000);
            let report = await Report.findOne({ messageID: message.id });
            if (report) correctReportList(client, message, message.id);
    });
}