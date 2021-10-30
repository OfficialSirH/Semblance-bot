import { MessageEmbed, Constants } from 'discord.js';
import type { Message, GuildChannel, PartialMessage } from 'discord.js';
import { getPermissionLevel } from '#constants/index';
import config from '#config';
import type { EventHandler } from '#lib/interfaces/Semblance';
const { prefix, c2sGuildId } = config;
const { Events } = Constants;

export default {
  name: Events.MESSAGE_UPDATE,
  exec: (_oldMsg, newMsg) => messageUpdate(newMsg),
} as EventHandler<'messageUpdate'>;

export const messageUpdate = async (newMsg: Message | PartialMessage) => {
  if (newMsg?.guild?.id != c2sGuildId || (newMsg.channel as GuildChannel).name != 'suggestions' || !newMsg.content)
    return;

  const msg = newMsg.content.toLowerCase(),
    suggestionArray = ['suggestion:', 'suggest:', `${prefix}suggestion`, `${prefix}suggest`],
    suggestionRegex = new RegExp(`^(?:${prefix})?suggest(?:ions|ion)?:?`, 'i');

  if (!!suggestionRegex.exec(msg) || getPermissionLevel(newMsg.member) > 0) return;

  newMsg.delete();
  const embed = new MessageEmbed().setTitle('Your Suggestion').setDescription(`\`${newMsg.content}\``);
  newMsg.author.send({
    content:
      `Your message in ${newMsg.channel} was deleted due to not having the ` +
      'suggestion-prefix required with suggestions, which means your message ' +
      `*must* start with ${suggestionArray.map(t => `\`${t}\``).join(', ')}. The ` +
      'reason for the required suggestion-prefixes is to prevent the channel ' +
      'getting messy due to conversations instead of actual suggestions.',
    embeds: [embed],
  });
};
