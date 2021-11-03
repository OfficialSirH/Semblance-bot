import { Information } from '#models/Information';
import { MessageEmbed, Constants } from 'discord.js';
import type { TextChannel } from 'discord.js';
import config from '#config';
import type { Semblance } from '#structures/Semblance';
import { checkReminders, randomColor } from '#constants/index';
import { intervalPost } from '../intervalPost.js';
import { checkBoosterRewards } from '#constants/models';
import type { EventHandler } from '#lib/interfaces/Semblance.js';
import { readdir } from 'fs/promises';
const { Events } = Constants;

export default {
  name: Events.CLIENT_READY,
  once: true,
  exec: (_, client) => ready(client),
} as EventHandler<'ready'>;

export const ready = async (client: Semblance) => {
  const { c2sGuildId } = config;
  console.log(`Logged in as ${client.user.tag}!`);

  const totalMembers = client.guilds.cache
    .map(g => g.memberCount)
    .filter(g => g)
    .reduce((total, cur) => (total += cur), 0);
  const activity = `@semblance help in ${client.guilds.cache.size} servers | ${totalMembers} members`;
  client.user.setActivity(activity, { type: 'WATCHING' });

  setInterval(() => {
    const totalMembers = client.guilds.cache
      .map(g => g.memberCount)
      .filter(g => g)
      .reduce((total, cur) => (total += cur), 0);
    const activity = `@semblance help in ${client.guilds.cache.size} servers | ${totalMembers} members`;
    if (client.user.presence.activities[0]?.name !== activity) client.user.setActivity(activity, { type: 'WATCHING' });
  }, 3600000);

  /* Slash Command setup */
  const slashCommands = await client.application.commands.fetch();
  const guildSlashCommands = await client.guilds.cache.get(c2sGuildId).commands.fetch();
  slashCommands
    .filter(c => c.type == 'CHAT_INPUT')
    .forEach(async command =>
      client.slashCommands.set(
        command.id,
        (await import(`#src/applicationCommands/slashCommands/${command.name}`)).default,
      ),
    );
  guildSlashCommands
    .filter(c => c.type == 'CHAT_INPUT')
    .forEach(async command =>
      client.slashCommands.set(
        command.id,
        (await import(`#src/applicationCommands/slashCommands/${command.name}`)).default,
      ),
    );
  const infoBuilders = (await readdir('./dist/src/infoBuilders')).filter(f => f.endsWith('.js'));
  infoBuilders.forEach(async file =>
    client.infoBuilders.set(
      file.replace('.js', ''),
      (await import(`#src/infoBuilders/${file.replace('.js', '')}`)).build,
    ),
  );

  /*
   * Reminder check
   */

  setInterval(() => {
    checkReminders(client);
  }, 60000);
  setInterval(() => {
    checkBoosterRewards(client);
  }, 1000 * 60 * 60 * 12);

  Information.findOne({ infoType: 'github' }).then(async infoHandler => {
    if (infoHandler.updated) {
      await Information.findOneAndUpdate({ infoType: 'github' }, { $set: { updated: false } });
      const embed = new MessageEmbed()
        .setTitle('Semblance Update')
        .setColor(randomColor)
        .setAuthor(client.user.tag, client.user.displayAvatarURL())
        .setDescription(`**${infoHandler.info}**`);

      (client.guilds.cache.get(c2sGuildId).channels.cache.find(c => c.name == 'semblance') as TextChannel).send({
        embeds: [embed],
      });
    }
  });

  await client.initializeLeaderboards();
  intervalPost(client);
};
