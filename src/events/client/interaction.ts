import { customIDRegex, getPermissionLevel } from '@semblance/constants';
import { ButtonData } from '@semblance/lib/interfaces/Semblance';
import { Semblance } from "@semblance/src/structures";
import { GuildMember, Message, MessageComponentInteraction, TextChannel } from 'discord.js';
import { promises as fs } from 'fs';
import config from '@semblance/config';
const { c2sGuildID } = config;

export const interaction = (client: Semblance) => {
    client.on('interaction', async interaction => {
        if (interaction.isMessageComponent()) return componentInteraction(client, interaction);
        if (!interaction.isCommand()) return;

        if (client.slashCommands.has(interaction.commandID)) 
            await client.slashCommands.get(interaction.commandID).run(client, interaction, 
                { options: interaction.options, permissionLevel: getPermissionLevel(interaction.member as GuildMember) });
        else await interaction.reply('I can\'t find a command for this, something is borked.');
    });
}

async function componentInteraction(client: Semblance, interaction: MessageComponentInteraction) {
    const message = interaction.message as Message;

    if (!interaction.customID.match(customIDRegex)) return console.log(`Detected oddly received custom ID from a button:\nCustom ID: \n${interaction.customID}\nuser ID: ${interaction.user.id}`);
    const data = eval(`(${interaction.customID})`) as ButtonData;
    const { action, id } = data;
    if (!client.componentHandlers.has(data.command)) return;
    const componentHandler = client.componentHandlers.get(data.command);
    if (interaction.user.id != id && !componentHandler.allowOthers) return await interaction.reply({ content: "This command wasn't called by you so you can't use it", ephemeral: true });
    componentHandler.run(interaction, data, { permissionLevel: getPermissionLevel(interaction.member as GuildMember) });
}