import type { Semblance } from '#structures/Semblance';
import { Constants } from 'discord.js';
import type { Message } from 'discord.js';
import config from '#config';
import { getPermissionLevel, parseArgs, prefix } from '#constants/index';
import { createBoosterRewards } from '#constants/models';
import type { EventHandler } from '#lib/interfaces/Semblance';
const { Events } = Constants;
const { sirhId, c2sGuildId, sirhGuildId, ignoredGuilds } = config;

export default {
  name: Events.MESSAGE_CREATE,
  exec: (message, client) => messageCreate(message, client),
} as EventHandler<'messageCreate'>;

export const messageCreate = async (message: Message, client: Semblance) => {
  if (message.channel.type == 'DM') return client.emit('messageDM', message);
  if (ignoredGuilds.includes(message.guild.id)) return;
  if (message.author.bot) return;

  const { commands, aliases } = client;

  //Cell to Singularity Exclusive Code
  const chName = message.channel.name;

  if (message.guild.id == c2sGuildId) {
    if (chName == 'booster-chat' && message.type == 'USER_PREMIUM_GUILD_SUBSCRIPTION')
      return createBoosterRewards(message);

    if (chName == 'share-your-prestige' && message.attachments.size == 0 && getPermissionLevel(message.member) == 0)
      message.delete();
    if (chName != 'semblance' && getPermissionLevel(message.member) == 0) return;
  }
  if (message.guild.id == sirhGuildId) {
    if (chName != 'bot-room' && chName != 'semblance-beta-testing' && getPermissionLevel(message.member) == 0) return;
  }
  //End of Cell to Singularity Exclusive Code
  if (message.mentions) {
    const msgMention = message.content.replace(/!/g, '');
    if (
      (msgMention == `<@${client.user.id}> ` || msgMention == `<@${client.user.id}>`) &&
      message.member.id != client.user.id
    ) {
      return message.reply(
        "Heyyo, I'm Semblance! I provide as much info as I possibly can for the simulation so you'll never be clueless in your adventure! " +
          ` you can either use \`/help query: *type anything here*\` or use ${prefix(
            client,
          )} help. Have fun and stay cellular!`,
      );
    }
  }

  //commands start here
  // keep usage of 's!' for backwards compatibility until everyone is fully aware of the new prefix and major changes
  if (message.content.startsWith('s!') || message.content.match(`^<@!?${client.user.id}> `)) {
    let splitContent = message.content.split(' ');
    if (splitContent[0].match(`^<@!?${client.user.id}>`)) splitContent.shift();
    else splitContent = message.content.slice('s!'.length).split(' ');
    const identifier = splitContent.shift().toLowerCase(),
      command = aliases[identifier] || identifier;
    const content = splitContent.join(' ');
    const commandFile = commands[command];
    if (!commandFile) return;
    if (commandFile.category == 'dm') {
      return message.reply('DM commands go in DMs(DM = Direct Message).');
    }
    let permissionLevel: number;
    const args = parseArgs(content);
    try {
      permissionLevel = getPermissionLevel(message.member);
    } catch {
      permissionLevel = message.author.id == sirhId ? 7 : 0;
    }
    try {
      if (permissionLevel < commandFile.permissionRequired)
        return message.channel.send("❌ You don't have permission to do this!");
      if (!commandFile.checkArgs(args, permissionLevel, content))
        return message.channel.send(
          `❌ Invalid arguments! Usage is '${prefix(client)}${command}${Object.keys(commandFile.usage)
            .map(a => ' ' + a)
            .join('')}', for additional help, see '${prefix(client)}help'.`,
        );
      commandFile.run(client, message, args, identifier, {
        permissionLevel,
        content,
      });
      console.log(command + ' Called by ' + message.author.username + ' in ' + message.guild.name);
    } catch {}
  }
};
