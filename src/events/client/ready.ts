import { Information } from '@semblance/models';
import { MessageEmbed, TextChannel, Constants } from 'discord.js';
import config from '@semblance/config';
import { Semblance } from '@semblance/src/structures';
import {
    checkReminders,
    randomColor
} from '@semblance/constants';
import { intervalPost } from '..';
const { c2sGuildId, prefix } = config;
const { Events } = Constants;

export const ready = (client: Semblance) => {
    client.on(Events.CLIENT_READY, async () => {
        console.log(`Logged in as ${client.user.tag}!`);

        client.setInterval(() => {
            let totalMembers = client.guilds.cache.map(g => g.memberCount).filter(g => g).reduce((total, cur, ind) => total += cur, 0);
            const activity = `${prefix}help in ${client.guilds.cache.size} servers | ${totalMembers} members`;
            if (client.user.presence.activities[0].name !== activity) client.user.setActivity(activity, { type: "WATCHING" });
        }, 30000);

        /* Slash Command setup */
        let slash_commands = await client.application.commands.fetch();
        slash_commands.forEach(command => client.slashCommands.set(command.id, require(`@semblance/src/slash_commands/${command.name}.js`)));

        /*
        * Reminder check
        */

        client.setInterval(() => { checkReminders(client) }, 60000);

        Information.findOne({ infoType: "github" })
            .then(async (infoHandler) => {
                if (infoHandler.updated) {
                    await Information.findOneAndUpdate({ infoType: "github" }, { $set: { updated: false } }, { new: true });
                    let embed = new MessageEmbed()
                        .setTitle("Semblance Update")
                        .setColor(randomColor)
                        .setAuthor(client.user.tag, client.user.displayAvatarURL())
                        .setDescription(`**${infoHandler.info}**`);

                    (client.guilds.cache.get(c2sGuildId).channels.cache.find(c => c.name == 'semblance') as TextChannel).send({ embeds: [embed] });
                }
            });
        
        await client.initializeLeaderboards();
        intervalPost(client);
    });
}