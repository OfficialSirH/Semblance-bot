import { GuildChannel, MessageEmbed, Constants } from 'discord.js';
import { getPermissionLevel } from '@semblance/constants';
import config from '@semblance/config';
import { Semblance } from '@semblance/src/structures';
const { prefix, c2sGuildId } = config;
const { Events } = Constants;

export const messageUpdate = (client: Semblance) => {
    client.on(Events.MESSAGE_UPDATE, async (oldMsg, newMsg) => {
        if (!newMsg.guild || !!newMsg.content || newMsg.content == null) return; // STOP IGNORING THIS YOU DUMB EVENT, YOU'RE SUPPOSED TO RETURN IF IT'S NULL!
        if (newMsg.guild.id == c2sGuildId) {
            let msg = newMsg.content.toLowerCase(), suggestionArray = ["suggestion:", "suggest:", `${prefix}suggestion`, `${prefix}suggest`],
                suggestionRegex = new RegExp(`^(?:${prefix})?suggest(?:ions|ion)?:?`, 'i');
            if ((newMsg.channel as GuildChannel).name == 'suggestions') {
                if (suggestionRegex.exec(msg) != null || getPermissionLevel(newMsg.member) > 0) return;
                else {
                    newMsg.delete();
                    let embed = new MessageEmbed()
                        .setTitle("Your Suggestion")
                        .setDescription(`\`${newMsg.content}\``);
                    newMsg.author.send({ content: `Your message in ${newMsg.channel} was deleted due to not having the `+
                            `suggestion-prefix required with suggestions, which means your message `+
                            `*must* start with ${suggestionArray.map(t => `\`${t}\``).join(', ')}. The `+
                            `reason for the required suggestion-prefixes is to prevent the channel `+
                            `getting messy due to conversations instead of actual suggestions.`, embeds: [embed] });
                }
            }
        }
    });
}