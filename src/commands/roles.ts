import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import type { Message, Snowflake } from 'discord.js';
import config from '@semblance/config';
import type { Command } from '@semblance/lib/interfaces/Semblance';
import { c2sRoles } from '../constants';
const { currentLogo, c2sGuildId } = config;

export default {
    description: "see the list of available roles for the c2s server",
    category: 'c2sServer',
    permissionRequired: 0,
    checkArgs: () => true,
    run: (_client, message) => run(message)
} as Command<'c2sServer'>;

const run = async (message: Message) => {
    const embed = new MessageEmbed()
        .setTitle("C2S Roles")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setThumbnail(currentLogo.name)
        .setDescription(["**Reality Expert**: This role is gained upon sending a screenshot of 1 trillion accumulated metabits from your ***stats page*** to <#496430259114082304>.",
            "**Paleontologist**: This role is gained once you've unlocked and sent a screenshot of the T-rex to <#496430259114082304>.",
            "**Beta Tester**: This role is gained when you've joined and sent proof of being part of the beta program for C2S to <#496430259114082304>.",
            "**Server Events**: This role can be obtained by pressing the button below, which this role means you'll get pinged for events happening in the server.",
            "**Martian Council**: This role is ***unobtainable*** as it's a moderator role so please stop asking how to get this role.",
            `**All of the other new roles**: https://canary.discord.com/channels/488478892873744385/496430259114082304/892369818387365910`].join('\n\n'))
        .setFooter("*Epic* roles."),
        hasServerEvents = message.member.roles.cache.has(c2sRoles.serverEvents as Snowflake),
    components = [new MessageActionRow()
        .addComponents([new MessageButton()
            .setDisabled(message.guild.id != c2sGuildId)
            .setCustomId(JSON.stringify({
                command: 'roles',
                action: hasServerEvents ? 'remove-events' : 'add-events',
                id: message.author.id
            }))
            .setEmoji(hasServerEvents ? '❌' : '✅')
            .setLabel(hasServerEvents ? 'Remove Server Events Role' : 'Add Server Events Role')
            .setStyle(hasServerEvents ? 'DANGER' : 'SUCCESS')
        ])];
    message.channel.send({ embeds: [embed], files: [currentLogo], components });
}
