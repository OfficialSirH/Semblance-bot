import { customIdRegex, getPermissionLevel, properCustomIdRegex } from '@semblance/constants';
import type { ButtonData } from '@semblance/lib/interfaces/Semblance';
import type { Semblance } from "@semblance/src/structures";
import { GuildMember, MessageComponentInteraction, Constants, Interaction, ContextMenuInteraction, AutocompleteInteraction } from 'discord.js';
const { Events } = Constants;

export default {
    name: Events.INTERACTION_CREATE,
    exec: (interaction: Interaction, client: Semblance) => interactionCreate(interaction, client)
}

export const interactionCreate = async (interaction: Interaction, client: Semblance) => {
    if (interaction.isAutocomplete()) return autocompleteInteraction(client, interaction);
    if (interaction.isMessageComponent()) return componentInteraction(client, interaction);
    if (interaction.isContextMenu()) return contextMenuInteraction(client, interaction);
    if (!interaction.isCommand()) return;

    if (client.slashCommands.has(interaction.commandId)) 
        await client.slashCommands.get(interaction.commandId).run(client, interaction, 
            { options: interaction.options, permissionLevel: getPermissionLevel(interaction.member as GuildMember) });
    else await interaction.reply('I can\'t find a command for this, something is borked.');
}

async function componentInteraction(client: Semblance, interaction: MessageComponentInteraction) {
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

const contextMenuInteraction = async (client: Semblance, interaction: ContextMenuInteraction) => {
    if (!client.contextMenuHandlers.has(interaction.commandName)) return;
    const contextMenuHandler = client.contextMenuHandlers.get(interaction.commandName);
    contextMenuHandler.run(interaction, { options: interaction.options, permissionLevel: getPermissionLevel(interaction.member as GuildMember) });
}

const autocompleteInteraction = async (client: Semblance, interaction: AutocompleteInteraction) => {
    if (!client.autocompleteHandlers.has(interaction.commandName)) return;
    const autocompleteHandler = client.autocompleteHandlers.get(interaction.commandName);
    autocompleteHandler.run(interaction, interaction.options);
}