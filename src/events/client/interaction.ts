import { getPermissionLevel } from '@semblance/constants';
import { ButtonData } from '@semblance/lib/interfaces/Semblance';
import { Semblance } from "@semblance/src/structures";
import { MessageComponentInteraction } from 'discord.js';
import { promises as fs } from 'fs';

export const interaction = (client: Semblance) => {
    client.on('interaction', async interaction => {
        if (interaction.isMessageComponent()) return componentInteraction(client, interaction);
        if (!interaction.isCommand()) return;
        
        const commandList = await fs.readdir('./dist/src/slash_commands');
        if (commandList.includes(interaction.commandName+'.js')) 
        await require(`@semblance/src/slash_commands/${interaction.commandName}.js`).run(client, interaction, 
            { options: interaction.options, permissionLevel: getPermissionLevel(interaction.member) });
        else await interaction.reply('I can\'t find a command for this, something is borked.');
        // TODO: Replace the command interaction usage of readdir with client.slashCommands
        /*
        if (client.slashCommands.has(interaction.commandID)) 
            await client.slashCommands.get(interaction.commandID).run(client, interaction, 
                { options: interaction.options, permissionLevel: getPermissionLevel(interaction.member) });
        else await interaction.reply('I can\'t find a command for this, something is borked.');
        */
    });
}

async function componentInteraction(client: Semblance, interaction: MessageComponentInteraction) {
    const data = eval(`(${interaction.customID})`) as ButtonData;
    const { action, id } = data;
    if (interaction.user.id != id) return await interaction.reply("This command wasn't called by you so you can't use it", { ephemeral: true });
    if (client.componentHandlers.has(data.command)) client.componentHandlers.get(data.command).run(interaction, { action, id } as ButtonData, 
        { permissionLevel: getPermissionLevel(interaction.member) });
}