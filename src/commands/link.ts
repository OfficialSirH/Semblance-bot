import { c2sGuildId } from '#config';
import { ChannelType, Collection } from 'discord.js';
import { createHmac } from 'crypto';
import type { SapphireClient } from '@sapphire/framework';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
const cooldown: Collection<string, number> = new Collection();

export default class Link extends Command {
  constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'link',
      description: 'link your C2S game progress with your Discord account.',
    });
  }
}

export default {
  description: "used for linking the C2S player's game with their Discord account.",
  category: 'dm',
  usage: {
    PLAYER_ID: "The user's in-game Id",
    PLAYER_TOKEN: "The user's in-game token",
  },
  permissionRequired: 0,
  checkArgs: args => args.length >= 2,
  run: (client, message, args) => run(client, message, args),
} as Command<'dm'>;

const run = async (client: SapphireClient, message: Message, args: string[]) => {
  if (message.channel.type != ChannelType.DM) message.delete();
  const userCooldown = cooldown.get(message.author.id);
  if (userCooldown && userCooldown > Date.now())
    return message.channel.send(
      `You cannot use the link command again for another ${(userCooldown - Date.now()) / 1000} seconds.`,
    );
  else cooldown.set(message.author.id, Date.now() + 30000);
  let failed = false;
  try {
    const isMember = !!(await client.guilds.cache.get(c2sGuildId).members.fetch(message.author.id));
    if (!isMember)
      return message.channel.send(
        'You need to be a member of the Cell to Singularity community server to use this command.',
      );
  } catch {
    failed = true;
    return message.channel.send(
      'You need to be a member of the Cell to Singularity community server to use this command.',
    );
  }
  if (failed) return;
  const [playerId, playerToken] = args;
  const token = createHmac('sha1', process.env.USERDATA_AUTH).update(playerId).update(playerToken).digest('hex');
  const dataAlreadyExists = await client.db.userData.findUnique({ where: { token } });
  if (dataAlreadyExists)
    return message.channel.send(
      'The provided data seems to already exist, which means this data is already linked to a discord account, if you feel this is false, please DM the owner(SirH).',
    );

  await client.db.userData
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
};
