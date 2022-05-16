import { MessageAttachment } from 'discord.js';
import * as fs from 'fs/promises';

export const attachments = {} as AttachmentList;

const files = await fs.readdir('./src/images/');
for (const file of files)
  if (file.endsWith('.png') || file.endsWith('.mp4')) {
    const attachment = new MessageAttachment(`./src/images/${file}`, `attachment://${file}`),
      attachmentName = file.substring(0, file.indexOf('.'));
    attachments[attachmentName] = attachment;
  }

export const sirhId = '780995336293711875',
  // organizer
  adityaId = '506458497718812674',
  // artist
  cabiieId = '342004536753520651',
  bloodexId = '297007456461258752',
  // contributors
  offpringlesId = '299174026411114497',
  jojoseisId = '325373529967296513',
  sampedrakoId = '651370672911679498',
  hardikId = '552102291616956416',
  // servers
  c2sGuildId = '488478892873744385',
  lunchGuildId = '796153726586454077',
  sirhGuildId = '794054988224659490',
  ignoredGuilds = ['439866052684283905', '110373943822540800', '374071874222686211'],
  // Early Private Beta Testers of the Beyond
  earlyBeyondTesters = [
    '658351740470689801', // 'Maxence#6028',
    sampedrakoId, // 'SampeDrako#1063',
    adityaId, // 'aditya20.0#1610',
    sirhId, // 'SirH#7157',
    '463767995790000130', // 'iMTV ?!#9864',
    '579379819888902165', // 'elias la glaçe#6248',
    '511988453353717762', // 'JonesyyBoyy#8247',
    '201211739684077568', // 'xKeepSiLenT#3275',
    hardikId, // 'Hardik Chavada#0844',
    '557915359705956375', // "C's Stuff#0421",
    '293382712276942850', // 'BlackHole-Chan#0273',
    '374266494235705344', // 'The Purple One#9049',
    '401451350023602197', // 'Ektrom#8320',
    '397847807974834186', // '✨ℭ𝕣𝕪𝕤𝕥𝕒𝕝 𝔊𝕝𝕚𝕟𝕥 ✨#0164',
    '388433470881529857', // 'g4genn#4529',
    '263156930879553537', // 'xXTacocubesXx#6012',
  ],
  // emojis
  entropy = '<:entropy:742748357163745413>',
  idea = '<:idea:775808337303437353>',
  c2s = '<:CellToSing:498910740200161280>',
  darwinium = '<:darwinium:742748359781122169>',
  metabitOG = '<:metabitOG:724684027419951177>',
  metabit = '<:metabit:789526514524880906>',
  mutagen = '<:mutagen:742748361852977184>',
  fossil = '<:fossil:742748364625543239>',
  trexBadge = '<:Dino_Gold:667471422334959619>',
  trexSkull = '<:trex_skull:657015647359860767>',
  singularity = '<:singularity:789526513812504617>',
  nanobotUp = '<:NanobotUp:764149893937102858>',
  nanobotDown = '<:NanobotDown:764149995032412180>',
  darkMatter = '<:dark_matter:946592770880061450>',
  stardust = '<:stardust:808445612013518868>',
  energy = '<:energy:808445587803471922>',
  sentience = '<:sentience:808445599078809670>',
  currentLogo = attachments['Current_Logo'],
  sharks = attachments['Sharks'],
  roadMap = attachments['RoadMap'],
  terminusChamber = attachments['TerminusChamber'],
  simStatsLocation = attachments['SimStatsLocation'],
  geodeImage = attachments['GeodeLevelComparison'],
  prestige = attachments['Prestige'],
  prestigeList = attachments['PrestigeList'],
  archieDance = attachments['ArchieDance'],
  nanobots = attachments['Nanobots'],
  currency = attachments['Currency'],
  mementoMori = attachments['MementoMori'];

type AttachmentList = Record<string, MessageAttachment>;
