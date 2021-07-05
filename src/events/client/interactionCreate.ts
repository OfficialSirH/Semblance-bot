import { customIdRegex, getPermissionLevel, properCustomIdRegex } from '@semblance/constants';
import { ButtonData } from '@semblance/lib/interfaces/Semblance';
import { Semblance } from "@semblance/src/structures";
import { GuildMember, Message, MessageComponentInteraction, Constants } from 'discord.js';
import { promises as fs } from 'fs';
import config from '@semblance/config';
const { c2sGuildId } = config;
const { Events } = Constants;

export const interactionCreate = (client: Semblance) => {
    client.on(Events.INTERACTION_CREATE, async interaction => {
        if (interaction.isMessageComponent()) return componentInteraction(client, interaction);
        if (!interaction.isCommand()) return;

        if (client.slashCommands.has(interaction.commandId)) 
            await client.slashCommands.get(interaction.commandId).run(client, interaction, 
                { options: interaction.options, permissionLevel: getPermissionLevel(interaction.member as GuildMember) });
        else await interaction.reply('I can\'t find a command for this, something is borked.');
    });
}

async function componentInteraction(client: Semblance, interaction: MessageComponentInteraction) {
    const message = interaction.message as Message;

    let data: ButtonData;
    if (interaction.customId.match(properCustomIdRegex)) data = JSON.parse(interaction.customId);
    else if (interaction.customId.match(customIdRegex)) data = eval(`(${interaction.customId})`);
    else return console.log(`Detected oddly received custom Id from a button:\nCustom Id: \n${interaction.customId}\nuser Id: ${interaction.user.id}`);
    const { action, id } = data;
    if (!client.componentHandlers.has(data.command)) return;
    const componentHandler = client.componentHandlers.get(data.command);
    if (interaction.user.id != id && !componentHandler.allowOthers) return await interaction.reply({ content: "This command wasn't called by you so you can't use it", ephemeral: true });
    componentHandler.run(interaction, data, { permissionLevel: getPermissionLevel(interaction.member as GuildMember) });
}