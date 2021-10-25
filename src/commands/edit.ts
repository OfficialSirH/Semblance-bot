import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import type { Command } from '#lib/interfaces/Semblance';
import { Information, InformationFormat } from '#models/Information';

export default {
  description: 'Used for editing information on the beta and update commands',
  category: 'developer',
  usage: {
    '<beta/update>': 'arguments for deciding which information you want to edit',
  },
  permissionRequired: 7,
  checkArgs: args => args.length >= 1,
  run: (_client, message, args) => run(message, args),
} as Command<'developer'>;

const run = async (message: Message, args: string[]) => {
  if (!args[1] || args[1].length == 0)
    return message.reply('Why are you trying to put nothing for the information? Come on!');
  let embed = new MessageEmbed()
    .setTitle(`${args[0].charAt(0).toUpperCase() + args[0].slice(1)} Info Changed!`)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(randomColor);
  let infoHandler: InformationFormat<any>;

  switch (args[0]) {
    case 'beta':
      infoHandler = (await Information.findOneAndUpdate(
        { infoType: 'beta' },
        { $set: { info: args.slice(1).join(' ') } },
        { new: true },
      )) as InformationFormat<'beta'>;
      embed.setDescription(infoHandler.info);
      break;
    case 'update':
      infoHandler = (await Information.findOneAndUpdate(
        { infoType: 'update' },
        { $set: { info: args.slice(1).join(' ') } },
        { new: true },
      )) as InformationFormat<'update'>;
      embed.setDescription(infoHandler.info);
      break;
    case 'codes':
      if (args[1] == 'expired')
        infoHandler = (await Information.findOneAndUpdate(
          { infoType: 'codes' },
          { $set: { expired: args.slice(2).join(' ') } },
          { new: true },
        )) as InformationFormat<'codes'>;
      else if (args[1] == 'footer')
        infoHandler = (await Information.findOneAndUpdate(
          { infoType: 'codes' },
          { $set: { footer: args.slice(2).join(' ') } },
          { new: true },
        )) as InformationFormat<'codes'>;
      else
        infoHandler = await Information.findOneAndUpdate(
          { infoType: 'codes' },
          { $set: { info: args.slice(1).join(' ') } },
          { new: true },
        );
      embed
        .setDescription(infoHandler.info)
        .addField('Expired Codes', infoHandler.expired)
        .setFooter(infoHandler.footer);
      break;
    case 'boostercodes':
      switch (args[1]) {
        case 'list':
          return listBoosterCodes(message);
        case 'add':
          return addBoosterCode(message, args.slice(2));
        case 'remove':
          return removeBoosterCode(message, args.slice(2));
        default:
          return message.reply('Invalid argument for boostercodes option. Choose `list`, `add`, or `remove`.');
      }
      break;
    case 'changelog':
      infoHandler = await Information.findOneAndUpdate(
        { infoType: 'changelog' },
        { $set: { info: args.slice(1).join(' ') } },
        { new: true },
      );
      embed.setDescription(infoHandler.info);
      break;
    default:
      return message.channel.send("What are you trying to type? The options are `beta`, `update`, and 'codes'");
  }
  message.channel.send({ embeds: [embed] });
};

const listBoosterCodes = async (message: Message) => {
  const darwiniumCodes = (await Information.findOne({ infoType: 'boostercodes' })) as InformationFormat<'boostercodes'>;
  const list = darwiniumCodes.list.length > 0 ? darwiniumCodes.list.join(', ') : 'None';
  const embed = new MessageEmbed()
    .setTitle(`Booster Codes`)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(`number of codes: ${darwiniumCodes.list.length}\n\`\`\`\n${list}\`\`\``)
    .setColor(randomColor);
  message.channel.send({ embeds: [embed] });
};
const addBoosterCode = async (message: Message, codes: string[]) => {
  if (codes.length == 0) return message.reply('You need to give me a code to add.');
  const darwiniumCodes = (await Information.findOne({ infoType: 'boostercodes' })) as InformationFormat<'boostercodes'>;
  if (codes.every(c => darwiniumCodes.list.includes(c)))
    return message.reply('All of the codes you provided are already in the list.');
  codes = codes.filter(c => !darwiniumCodes.list.includes(c));
  darwiniumCodes.list = darwiniumCodes.list.concat(codes);
  await Information.findOneAndUpdate(
    { infoType: 'boostercodes' },
    { $set: { list: darwiniumCodes.list } },
    { new: true },
  );
  const list = darwiniumCodes.list.length > 0 ? darwiniumCodes.list.join(', ') : 'None';
  const embed = new MessageEmbed()
    .setTitle(`Booster Codes`)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(
      `**The provided codes were successfully added**\nnew number of codes: ${darwiniumCodes.list.length}\n\`\`\`\n${list}\`\`\``,
    )
    .setColor(randomColor);
  message.channel.send({ embeds: [embed] });
};

const removeBoosterCode = async (message: Message, codes: string[]) => {
  if (codes.length == 0) return message.reply('You need to give me a code to remove.');
  const darwiniumCodes = (await Information.findOne({ infoType: 'boostercodes' })) as InformationFormat<'boostercodes'>;
  if (codes.every(c => !darwiniumCodes.list.includes(c)))
    return message.reply("All of the codes you provided aren't in the list.");
  codes = codes.filter(c => darwiniumCodes.list.includes(c));
  darwiniumCodes.list = darwiniumCodes.list.filter(c => !codes.includes(c));
  await Information.findOneAndUpdate(
    { infoType: 'boostercodes' },
    { $set: { list: darwiniumCodes.list } },
    { new: true },
  );
  const list = darwiniumCodes.list.length > 0 ? darwiniumCodes.list.join(', ') : 'None';
  const embed = new MessageEmbed()
    .setTitle(`Booster Codes`)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(
      `**The provided codes were successfully removed**\nnew number of codes: ${darwiniumCodes.list.length}\n\`\`\`\n${list}\`\`\``,
    )
    .setColor(randomColor);
  message.channel.send({ embeds: [embed] });
};
