import { Message, MessageActionRow, MessageButton, MessageEmbed, Snowflake } from 'discord.js';
import config from '@semblance/config';
import { Semblance } from '../structures';
import { c2sRoles } from '../constants';
const { currentLogo, c2sGuildId } = config;

module.exports = {
    description: "",
    category: 'c2sServer',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    const embed = new MessageEmbed()
        .setTitle("C2S Roles")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setThumbnail(currentLogo.name)
        .setDescription(["**Reality Expert**: This role is gained upon sending a screenshot of 1 billion accumulated metabits from your ***stats page*** to <#496430259114082304>.",
            "**Paleontologist**: This role is gained once you've unlocked and sent a screenshot of the T-rex to <#496430259114082304>.",
            "**Beta Tester**: This role is gained when you've joined and sent proof of being part of the beta program for C2S to <#496430259114082304>.",
            "**Server Events**: This role can be obtained by pressing the button below, which this role means you'll get pinged for events happening in the server.",
            "**Martian Council**: This role is ***unobtainable*** as it's a moderator role so please stop asking how to get this role.",
            ["***NOTICE***",
            "**Beta Tester proof**: by *proof* for having the beta doesn't mean sending a screenshot of '(beta)' in the Google Play Store, about 99% of the time, that's not actually the beta. Please send a screenshot of your version number, which you can find right at the bottom of the Menu UI in-game, if you want the Beta Tester role. Also, double check announcements if beta was fully released before posting ***I have Beta!!***.",
            '**Reality Expert screenshots**: When sending a screenshot of your stats page for the Reality Expert role, send the ***ENTIRE stats page***, cropping out parts of the stats page will have your screenshot be ignored.'].join('\n')].join('\n\n'))
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
