const { reportChannelList, correctReportList, Report } = require('../commands/bug.js'),
    { c2sID } = require('../config');

module.exports = (client) => {
    client.on("messageDelete", async message => {
            if (message.guild.id != c2sID || !reportChannelList.includes(message.channel.id)) return;
            await wait(3000);
            let report = await Report.findOne({ messageID: message.id });
            if (report) correctReportList(client, message, message.id);
    });
}