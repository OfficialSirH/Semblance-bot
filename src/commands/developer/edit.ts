import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, randomColor } from '#constants/index';
import { type Args, Command } from '@sapphire/framework';
import type { Information } from '@prisma/client';

export default class Edit extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'edit',
      description: 'edit information on commands that has ever-changing information',
      fullCategory: [Categories.developer],
      preconditions: ['OwnerOnly'],
    });
  }

  public override async messageRun(message: Message, args: Args) {
    const commandName = await args.pickResult('string');
    if (!commandName.success) return message.reply('You need to provide a command name.');
    const action = await args.pickResult('string');
    if (!action.success) return message.reply('resolving the optional action failed.');
    const info = await args.restResult('string');
    if (!info.success)
      return message.reply("You need to provide the information you want to replace the command's current info with.");

    const infoWithAction = `${action.value} ${info.value}`;

    const embed = new MessageEmbed()
      .setTitle(`${commandName.value.charAt(0).toUpperCase() + commandName.value.slice(1)} Info Changed!`)
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
      .setColor(randomColor);
    let infoHandler: Information;

    switch (commandName.value) {
      case 'beta':
        infoHandler = await message.client.db.information.update({
          where: { type: 'beta' },
          data: { value: infoWithAction },
        });
        embed.setDescription(infoHandler.value);
        break;
      case 'joinbeta':
        infoHandler = await message.client.db.information.update({
          where: { type: 'joinbeta' },
          data: { value: infoWithAction },
        });
        embed.setDescription(infoHandler.value);
        break;
      case 'update':
        infoHandler = await message.client.db.information.update({
          where: { type: 'update' },
          data: { value: infoWithAction },
        });
        embed.setDescription(infoHandler.value);
        break;
      case 'codes':
        if (action.value == 'expired')
          infoHandler = await message.client.db.information.update({
            where: { type: 'codes' },
            data: { expired: info.value },
          });
        else if (action.value == 'footer')
          infoHandler = await message.client.db.information.update({
            where: { type: 'codes' },
            data: { footer: info.value },
          });
        else
          infoHandler = await message.client.db.information.update({
            where: { type: 'codes' },
            data: { value: infoWithAction },
          });
        embed
          .setDescription(infoHandler.value)
          .addField('Expired Codes', infoHandler.expired)
          .setFooter({ text: infoHandler.footer });
        break;
      case 'boostercodes':
        switch (action.value) {
          case 'list':
            return listBoosterCodes(message);
          case 'add':
            return addBoosterCode(message, info.value.split(' '));
          case 'remove':
            return removeBoosterCode(message, info.value.split(' '));
          default:
            return message.reply('Invalid argument for boostercodes option. Choose `list`, `add`, or `remove`.');
        }
      case 'changelog':
        infoHandler = await message.client.db.information.update({
          where: { type: 'changelog' },
          data: { value: infoWithAction },
        });
        embed.setDescription(infoHandler.value);
        break;
      default:
        return message.channel.send(
          'What are you trying to type? The options are `beta`, `update`, `boostercodes`, and `codes`.',
        );
    }
    message.channel.send({ embeds: [embed] });
  }
}

const listBoosterCodes = async (message: Message) => {
  const darwiniumCodes = await message.client.db.boosterCodes.findMany({});
  const list = darwiniumCodes.length > 0 ? darwiniumCodes.map(c => c.code).join(', ') : 'None';
  const embed = new MessageEmbed()
    .setTitle('Booster Codes')
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
    .setDescription(`number of codes: ${darwiniumCodes.length}\n\`\`\`\n${list}\`\`\``)
    .setColor(randomColor);
  message.channel.send({ embeds: [embed] });
};

const addBoosterCode = async (message: Message, codes: string[]) => {
  if (codes.length == 0) return message.reply('You need to give me a code to add.');

  const darwiniumCodes = await message.client.db.boosterCodes.findMany({});
  if (codes.every(c => darwiniumCodes.map(code => code.code).includes(c)))
    return message.reply('All of the codes you provided are already in the list.');

  codes = codes.filter(c => !darwiniumCodes.map(code => code.code).includes(c));
  await message.client.db.boosterCodes.createMany({
    data: codes.map(c => ({ code: c })),
  });

  const list = darwiniumCodes.map(c => c.code).concat(codes);
  const embed = new MessageEmbed()
    .setTitle('Booster Codes')
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
    .setDescription(
      `**The provided codes were successfully added**\nnew number of codes: ${list.length}\n\`\`\`\n${list.join(
        ', ',
      )}\`\`\``,
    )
    .setColor(randomColor);
  message.channel.send({ embeds: [embed] });
};

const removeBoosterCode = async (message: Message, codes: string[]) => {
  if (codes.length == 0) return message.reply('You need to give me a code to remove.');

  const darwiniumCodes = await message.client.db.boosterCodes.findMany({});
  if (codes.every(c => !darwiniumCodes.map(code => code.code).includes(c)))
    return message.reply("All of the codes you provided aren't in the list.");

  codes = codes.filter(c => darwiniumCodes.map(c => c.code).includes(c));
  const filteredList = darwiniumCodes.filter(c => !codes.includes(c.code)).map(c => c.code);

  await message.client.db.boosterCodes.deleteMany({
    where: {
      code: {
        in: codes,
      },
    },
  });

  const embed = new MessageEmbed()
    .setTitle('Booster Codes')
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
    .setDescription(
      `**The provided codes were successfully removed**\nnew number of codes: ${
        filteredList.length
      }\n\`\`\`\n${filteredList.join(', ')}\`\`\``,
    )
    .setColor(randomColor);
  message.channel.send({ embeds: [embed] });
};
