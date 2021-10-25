import { UserData } from '#models/UserData';
import config from '#config';
import { Collection } from 'discord.js';
import { createHmac } from 'crypto';
import type { Semblance } from '#structures/Semblance';
import type { Command } from '#lib/interfaces/Semblance';
import type { Message } from 'discord.js';
const { c2sGuildId } = config;
const cooldown: Collection<string, number> = new Collection();

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

const run = async (client: Semblance, message: Message, args: string[]) => {
  if (message.channel.type != 'DM') return;
  const userCooldown = cooldown.get(message.author.id);
  if (userCooldown && userCooldown > Date.now())
    return message.channel.send(
      `You cannot use the link command again for another ${(userCooldown - Date.now()) / 1000} seconds.`,
    );
  else cooldown.set(message.author.id, Date.now() + 30000);
  try {
    const isMember = !!(await client.guilds.cache.get(c2sGuildId).members.fetch(message.author.id));
    if (!isMember)
      return message.channel.send(
        'You need to be a member of the Cell to Singularity community server to use this command.',
      );
  } catch {
    return message.channel.send(
      'You need to be a member of the Cell to Singularity community server to use this command.',
    );
  } finally {
    let playerId: string, playerToken: string;
    [playerId, playerToken] = args;
    const token = createHmac('sha1', process.env.USERDATA_AUTH).update(playerId).update(playerToken).digest('hex');
    const dataAlreadyExists = await UserData.findOne({ token });
    if (dataAlreadyExists)
      return message.channel.send(
        `The provided data seems to already exist, which means this data is already linked to a discord account, if you feel this is false, please DM the owner(SirH).`,
      );
    const updatedUser = !!(await UserData.findOneAndUpdate(
      { discordId: message.author.id },
      { $set: { token, edited_timestamp: Date.now() } },
      { new: true },
    ));
    if (updatedUser) {
      console.log(`${message.author.tag}(${message.author.id}) successfully linked their C2S data.`);
      return message.channel.send(
        `The link was successful, now you can use the Discord button in-game to upload your progress.`,
      );
    }
    const newUser = new UserData({ token, discordId: message.author.id });
    newUser.save(function (err, entry) {
      if (err)
        return message.channel.send(
          `An error occured, either you provided incorrect input or something randomly didn't want to work.`,
        );
      message.channel.send(
        `The link was successful, now you can use the Discord button in-game to upload your progress.`,
      );
    });
  }
};
