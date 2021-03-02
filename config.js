const { MessageAttachment } = require('discord.js'),
    attachmentURL = 'attachment://',
    attachments = {},
    fs = require('fs');

fs.readdir("./images/", (err, files) => {
    if (err) console.log(err);
    for (const file of files) {
        const attachment = new MessageAttachment(`./images/${file}`, `attachment://${file}`), attachmentName = file.substring(0, file.indexOf("."));
        attachments[attachmentName] = attachment;
    }
    module.exports = Object.assign(module.exports, {
        attachments,
        currentLogo: attachments['Current_Logo'],
        sharks: attachments['Sharks'],
        roadMap: attachments['roadMap'],
        terminusChamber: attachments['TerminusChamber'],
        simStatsLocation: attachments['SimStatsLocation'],
        geodeImage: attachments['GeodeLevelComparison'],
        prestige: attachments['Prestige'],
        prestigeList: attachments['PrestigeList'],
        archieDance: attachments['ArchieDance'],
        patreon: attachments['Patreon_Mark_Coral'],
        sembcommunist: attachments['CommunistSemblance'],
        nanobots: attachments['Nanobots'],
        mementoMori: attachments['MementoMori']
    });
})

module.exports = {
    prefix: "s!",
    sembID: "794033850665533450",
    sirhID: "780995336293711875",
    adityaID: '506458497718812674',
    c2sID: "488478892873744385",
    lunchGuildID: '796153726586454077',
    sirhGuildID: "794054988224659490",
    ignoredGuilds: ["264445053596991498",
            "439866052684283905",
            "450100127256936458",
            "110373943822540800",
            "374071874222686211",], // TODO: Add 387812458661937152 back into list AFTER they verify the bot
}