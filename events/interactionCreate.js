const { getAvatar, getPermissionLevel } = require('../constants'),
    { c2sID } = require('../config');

async function send(interaction, { content = null, embeds = [], type = 4, flags = 0 } = {}) {
    client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: type,
        data: {
            content: content,
            embeds: embeds,
            flags: flags
        }
    }})
}

module.exports = (client) => {
    client.ws.on("INTERACTION_CREATE", async interaction => {
        const slashCommands = client.slashCommands;
        const command = slashCommands[interaction.data.id];
        if (!!command) {
            let guild = client.guilds.cache.get(interaction.guild_id),
                member = await guild.members.fetch(interaction.member.user.id),
                permissionLevel = await getPermissionLevel(member),
                channel = guild.channels.cache.get(interaction.channel_id);
            console.log(`${member.user.tag} : ${permissionLevel}`);
            if ((guild.id == c2sID && channel.name != 'semblance' && permissionLevel == 0) || permissionLevel < command.permissionRequired) 
                return send(interaction, { content: 'Ah ah ah! You didn\'t say the magic word!', flags: 1 << 6, type: 3 });
            
            interaction.member.user.tag = `${interaction.member.user.username}#${interaction.member.user.discriminator}`;
            interaction.member.user.avatarURL = getAvatar(interaction.member.user);
            let result = await command.run(client, interaction, { permissionLevel, options: interaction.data.options });
            return send(interaction, ...result);
        }

        console.log(`${interaction.data.name}\n${interaction.data.id}`);
    });
}