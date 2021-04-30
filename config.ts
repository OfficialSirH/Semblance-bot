import { MessageAttachment } from 'discord.js';
import * as fs from 'fs';    

const attachmentURL = 'attachment://',
    attachments = {} as AttachmentList;

fs.readdir("./images/", (err, files) => {
    if (err) console.log(err);
    for (const file of files) {
        const attachment = new MessageAttachment(`./images/${file}`, `attachment://${file}`), attachmentName = file.substring(0, file.indexOf("."));
        attachments[attachmentName] = attachment;
    }
    module.exports.default = Object.assign(module.exports.default, {
        attachments,
        currentLogo: attachments['Current_Logo'],
        sharks: attachments['Sharks'],
        roadMap: attachments['RoadMap'],
        terminusChamber: attachments['TerminusChamber'],
        simStatsLocation: attachments['SimStatsLocation'],
        geodeImage: attachments['GeodeLevelComparison'],
        prestige: attachments['Prestige'],
        prestigeList: attachments['PrestigeList'],
        archieDance: attachments['ArchieDance'],
        patreon: attachments['Patreon_Mark_Coral'],
        communistSemblance: attachments['CommunistSemblance'],
        nanobots: attachments['Nanobots'],
        mementoMori: attachments['MementoMori']
    });
})

export default {
    prefix: "s!",
    sirhID: "780995336293711875",
    adityaID: '506458497718812674',
    c2sGuildID: "488478892873744385",
    lunchGuildID: '796153726586454077',
    sirhGuildID: "794054988224659490",
    ignoredGuilds: ["264445053596991498",
        "439866052684283905",
        "450100127256936458",
        "110373943822540800",
        "374071874222686211",],
    entropy: '<:entropy:742748357163745413>',
    idea: '<:idea:775808337303437353>',
    c2s: '<:CellToSing:498910740200161280>',
    darwinium: '<:darwinium:742748359781122169>',
    metabitOG: '<:metabitOG:724684027419951177>',
    metabit: '<:metabit:789526514524880906>',
    mutagen: '<:mutagen:742748361852977184>',
    fossil: '<:fossil:742748364625543239>',
    trexBadge: '<:Dino_Gold:667471422334959619>',
    trexSkull: '<:trex_skull:657015647359860767>',
    singularity: '<:singularity:789526513812504617>',
    nanobotUp: '<:NanobotUp:764149893937102858>',
    nanobotDown: '<:NanobotDown:764149995032412180>',
    darkMatter: '<:darkMatter:808445570078867496>',
    stardust: '<:stardust:808445612013518868>',
    energy: '<:energy:808445587803471922>',
    sentience: '<:sentience:808445599078809670>'
}

interface AttachmentList {
    [key: string]: MessageAttachment
}