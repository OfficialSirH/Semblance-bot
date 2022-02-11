import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import type { Command } from '#lib/interfaces/Semblance';
import type { Information } from '@prisma/client';
import type { SapphireClient } from '@sapphire/framework';

export default {
  description: 'Used for editing information on the beta and update commands',
  category: 'developer',
  usage: {
    '<beta/update>': 'arguments for deciding which information you want to edit',
  },
  permissionRequired: 7,
  checkArgs: args => args.length >= 1,
  run: (client, message, args) => run(client, message, args),
} as Command<'developer'>;

const run = async (client: SapphireClient, message: Message, args: string[]) => {
  if (!args[1] || args[1].length == 0)
    return message.reply('Why are you trying to put nothing for the information? Come on!');
  const embed = new Embed()
    .setTitle(`${args[0].charAt(0).toUpperCase() + args[0].slice(1)} Info Changed!`)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(randomColor);
  let infoHandler: Information;

  switch (args[0]) {
    case 'beta':
      infoHandler = await client.db.information.update({
        where: { type: 'beta' },
        data: { value: args.slice(1).join(' ') },
      });
      embed.setDescription(infoHandler.value);
      break;
    case 'joinbeta':
      infoHandler = await client.db.information.update({
        where: { type: 'joinbeta' },
        data: { value: args.slice(1).join(' ') },
      });
      embed.setDescription(infoHandler.value);
      break;
    case 'update':
      infoHandler = await client.db.information.update({
        where: { type: 'update' },
        data: { value: args.slice(1).join(' ') },
      });
      embed.setDescription(infoHandler.value);
      break;
    case 'codes':
      if (args[1] == 'expired')
        infoHandler = await client.db.information.update({
          where: { type: 'codes' },
          data: { expired: args.slice(2).join(' ') },
        });
      else if (args[1] == 'footer')
        infoHandler = await client.db.information.update({
          where: { type: 'codes' },
          data: { footer: args.slice(2).join(' ') },
        });
      else
        infoHandler = await client.db.information.update({
          where: { type: 'codes' },
          data: { value: args.slice(1).join(' ') },
        });
      embed
        .setDescription(infoHandler.value)
        .addField('Expired Codes', infoHandler.expired)
        .setFooter(infoHandler.footer);
      break;
    case 'boostercodes':
      switch (args[1]) {
        case 'list':
          return listBoosterCodes(client, message);
        case 'add':
          return addBoosterCode(client, message, args.slice(2));
        case 'remove':
          return removeBoosterCode(client, message, args.slice(2));
        default:
          return message.reply('Invalid argument for boostercodes option. Choose `list`, `add`, or `remove`.');
      }
    case 'changelog':
      infoHandler = await client.db.information.update({
        where: { type: 'changelog' },
        data: { value: args.slice(1).join(' ') },
      });
      embed.setDescription(infoHandler.value);
      break;
    default:
      return message.channel.send("What are you trying to type? The options are `beta`, `update`, and 'codes'");
  }
  message.channel.send({ embeds: [embed] });
};

const listBoosterCodes = async (client: SapphireClient, message: Message) => {
  const darwiniumCodes = await client.db.boosterCodes.findMany({});
  const list = darwiniumCodes.length > 0 ? darwiniumCodes.map(c => c.code).join(', ') : 'None';
  const embed = new Embed()
    .setTitle('Booster Codes')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(`number of codes: ${darwiniumCodes.length}\n\`\`\`\n${list}\`\`\``)
    .setColor(randomColor);
  message.channel.send({ embeds: [embed] });
};

const addBoosterCode = async (client: SapphireClient, message: Message, codes: string[]) => {
  if (codes.length == 0) return message.reply('You need to give me a code to add.');

  const darwiniumCodes = await client.db.boosterCodes.findMany({});
  if (codes.every(c => darwiniumCodes.map(code => code.code).includes(c)))
    return message.reply('All of the codes you provided are already in the list.');

  codes = codes.filter(c => !darwiniumCodes.map(code => code.code).includes(c));
  await client.db.boosterCodes.createMany({
    data: codes.map(c => ({ code: c })),
  });

  const list = darwiniumCodes.map(c => c.code).concat(codes);
  const embed = new Embed()
    .setTitle('Booster Codes')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(
      `**The provided codes were successfully added**\nnew number of codes: ${list.length}\n\`\`\`\n${list.join(
        ', ',
      )}\`\`\``,
    )
    .setColor(randomColor);
  message.channel.send({ embeds: [embed] });
};

const removeBoosterCode = async (client: SapphireClient, message: Message, codes: string[]) => {
  if (codes.length == 0) return message.reply('You need to give me a code to remove.');

  const darwiniumCodes = await client.db.boosterCodes.findMany({});
  if (codes.every(c => !darwiniumCodes.map(code => code.code).includes(c)))
    return message.reply("All of the codes you provided aren't in the list.");

  codes = codes.filter(c => darwiniumCodes.map(c => c.code).includes(c));
  const filteredList = darwiniumCodes.filter(c => !codes.includes(c.code)).map(c => c.code);

  await client.db.boosterCodes.deleteMany({
    where: {
      code: {
        in: codes,
      },
    },
  });

  const embed = new Embed()
    .setTitle('Booster Codes')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(
      `**The provided codes were successfully removed**\nnew number of codes: ${
        filteredList.length
      }\n\`\`\`\n${filteredList.join(', ')}\`\`\``,
    )
    .setColor(randomColor);
  message.channel.send({ embeds: [embed] });
};
