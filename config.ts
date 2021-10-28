import { MessageAttachment } from 'discord.js';
import type { Snowflake } from 'discord.js';
import * as fs from 'fs/promises';

const attachments = {} as AttachmentList;

const files = await fs.readdir('./src/images/');
for (const file of files) if (file.endsWith('.png') || file.endsWith('.mp4')) {
    const attachment = new MessageAttachment(`./src/images/${file}`, `attachment://${file}`), attachmentName = file.substring(0, file.indexOf('.'));
    attachments[attachmentName] = attachment;
}

export default {
    prefix: 's!',
    sirhId: '780995336293711875' as Snowflake,
    // organizer
    adityaId: '506458497718812674' as Snowflake,
    // artist
    cabiieId: '342004536753520651' as Snowflake,
    bloodexId: '297007456461258752' as Snowflake,
    // contributors
    offpringlesId: '299174026411114497' as Snowflake,
    jojoseisId: '325373529967296513' as Snowflake,
    sampedrakoId: '651370672911679498' as Snowflake,
    hardikId: '552102291616956416' as Snowflake,
    // servers
    c2sGuildId: '488478892873744385' as Snowflake,
    lunchGuildId: '796153726586454077' as Snowflake,
    sirhGuildId: '794054988224659490' as Snowflake,
    ignoredGuilds: ['264445053596991498',
        '439866052684283905',
        '450100127256936458',
        '110373943822540800',
        '374071874222686211'] as Snowflake[],
    // Early Private Beta Testers of the Beyond
    earlyBeyondTesters: [
        'Maxence#6028',
        'SampeDrako#1063',
        'aditya20.0#1610',
        'SirH#7157',
        'iMTV ?!#9864',
        'elias la glaçe#6248',
        'JonesyyBoyy#8247',
        'xKeepSiLenT#3275',
        'Hardik Chavada#0844',
        'C\'s Stuff#0421',
        'BlackHole-Chan#0273',
        'The Purple One#9049',
        'Ektrom#8320',
        '✨ℭ𝕣𝕪𝕤𝕥𝕒𝕝 𝔊𝕝𝕚𝕟𝕥 ✨#0164',
        'g4genn#4529',
        'xXTacocubesXx#6012'
    ],
    // emojis
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
    sentience: '<:sentience:808445599078809670>',
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
    currency: attachments['Currency'],
    mementoMori: attachments['MementoMori']
};

type AttachmentList = Record<string, MessageAttachment>;