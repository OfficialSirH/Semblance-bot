import { getAvatar, getPermissionLevel } from '@semblance/constants';
import config from '@semblance/config';
import { Interaction, Semblance }from '@semblance/structures';
import { RawInteraction } from '@semblance/lib/interfaces/interaction';
const { c2sGuildID } = config;

async function send(client: Semblance, interaction: Interaction, { content = null, embeds = [], type = 4, flags = 0 } = {}) {
    client.call.interactions(interaction.id, interaction.token).callback.post({data: {
        type: type,
        data: {
            content: content,
            embeds: embeds,
            flags: flags
        }
    }})
}

export const interactionCreate = (client: Semblance) => {
    client.ws.on("INTERACTION_CREATE", async (rawInteraction: RawInteraction) => {

        const member = await client.guilds.cache.get(rawInteraction.guild_id).members.fetch(rawInteraction.member.user.id);
        rawInteraction = {
            ...rawInteraction,
            client,
            member
        };
        const interaction = new Interaction(rawInteraction);
        const command = client.slashCommands[interaction.data.id];
        if (!!command) {
            // let guild = client.guilds.cache.get(interaction.guild_id),
            //     member = await guild.members.fetch(interaction.member.user.id),
            //     permissionLevel = await getPermissionLevel(member),
            //     channel = guild.channels.cache.get(interaction.channel_id);
            const { guild, channel } = interaction; 
            const permissionLevel = getPermissionLevel(member);
            // console.log(interaction.toJSON());
            console.log(`Slash Command Log:\nUser: ${member.user.tag}(${member.user.id})\nPermission Level: ${permissionLevel}\nCommand: ${interaction.data.name}`);

            if ((guild.id == c2sGuildID && channel.name != 'semblance' && permissionLevel == 0) || permissionLevel < command.permissionRequired) 
                return interaction.send('Ah ah ah! You didn\'t say the magic word!', { ephemeral: true });
                // return send(client, interaction, { content: 'Ah ah ah! You didn\'t say the magic word!', flags: 1 << 6 });
            
            // interaction.member.user.tag = `${interaction.member.user.username}#${interaction.member.user.discriminator}`;
            // interaction.member.user.avatarURL = getAvatar(interaction.member.user);
            const result = await command.run(client, interaction, { permissionLevel, options: interaction.data.options });
            // const { content, embeds, flags, type } = result;
            // return interaction.send(content, { embeds, ephemeral: flags == 64, type });
            // return send(client, interaction, ...result);
        }
        else console.log(`${interaction.data.name}\n${interaction.data.id}`);
    });
}