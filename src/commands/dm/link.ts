import { c2sGuildId } from '#config';
import { createHmac } from 'crypto';
import type { Args } from '@sapphire/framework';
import { Command } from '@sapphire/framework';
import { ChannelType, type Message } from 'discord.js';
import { Categories } from '#constants/index';

// TODO: make this no longer require the need for stupid DMs

export default class Link extends Command {
  constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'link',
      description:
        'link your C2S game progress with your Discord account for simplifying the process of gaining roles in the community.',
      fullCategory: [Categories.dm],
    });
  }

  public override async messageRun(message: Message, args: Args) {
    if (message.channel.type != ChannelType.DM) message.delete().catch(() => null);

    const isMember = !!(await message.client.guilds.cache
      .get(c2sGuildId)
      .members.fetch(message.author.id)
      .catch(() => null));
    if (!isMember)
      return message.channel.send(
        'You need to be a member of the Cell to Singularity community server to use this command.',
      );

    const playerId = await args.pickResult('string');
    if (!playerId.success) return message.reply('You need to provide a player ID.');
    const playerToken = await args.pickResult('string');
    if (!playerToken.success) return message.reply('You need to provide a player token.');

    const token = createHmac('sha1', process.env.USERDATA_AUTH)
      .update(playerId.value)
      .update(playerToken.value)
      .digest('hex');
    const dataAlreadyExists = await message.client.db.userData.findUnique({ where: { token } });
    if (dataAlreadyExists)
      return message.channel.send(
        'The provided data seems to already exist, which means this data is already linked to a discord account, if you feel this is false, please DM the owner(SirH).',
      );

    await message.client.db.userData
      .upsert({
        where: { discord_id: message.author.id },
        update: { token },
        create: { discord_id: message.author.id, token },
      })
      .then(async () => {
        console.log(`${message.author.tag}(${message.author.id}) successfully linked their C2S data.`);
        await message.channel.send(
          'The link was successful, now you can use the Discord button in-game to upload your progress.',
        );
      })
      .catch(() =>
        message.channel.send(
          "An error occured, either you provided incorrect input or something randomly didn't want to work.",
        ),
      );
  }
}
