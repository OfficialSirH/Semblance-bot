import { Information } from '#models/Information';
import { MessageEmbed, Constants } from 'discord.js';
import type { TextChannel } from 'discord.js';
import config from '#config';
import type { Semblance } from '#structures/Semblance';
import { checkReminders, randomColor } from '#constants/index';
import { intervalPost } from '../intervalPost.js';
import { checkBoosterRewards } from '#constants/models';
const { c2sGuildId, prefix, ignoredGuilds } = config;
const { Events } = Constants;

export default {
  name: Events.CLIENT_READY,
  once: true,
  exec: (client: Semblance) => ready(client),
};

export const ready = async (client: Semblance) => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.guilds.cache.sweep(guild => ignoredGuilds.includes(guild.id));

  const totalMembers = client.guilds.cache
    .map(g => g.memberCount)
    .filter(g => g)
    .reduce((total, cur, ind) => (total += cur), 0);
  const activity = `${prefix}help in ${client.guilds.cache.size} servers | ${totalMembers} members`;
  client.user.setActivity(activity, { type: 'WATCHING' });

  setInterval(() => {
    let totalMembers = client.guilds.cache
      .map(g => g.memberCount)
      .filter(g => g)
      .reduce((total, cur, ind) => (total += cur), 0);
    const activity = `${prefix}help in ${client.guilds.cache.size} servers | ${totalMembers} members`;
    if (client.user.presence.activities[0]?.name !== activity) client.user.setActivity(activity, { type: 'WATCHING' });
  }, 3600000);

  /* Slash Command setup */
  const slashCommands = await client.application.commands.fetch();
  slashCommands
    .filter(c => c.type == 'CHAT_INPUT')
    .forEach(async command =>
      client.slashCommands.set(
        command.id,
        (await import(`#src/applicationCommands/slashCommands/${command.name}`)).default,
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
      let embed = new MessageEmbed()
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
