import { customIdRegex, disableAllComponents, getPermissionLevel, properCustomIdRegex } from '#constants/index';
import type { CustomIdData, EventHandler } from '#lib/interfaces/Semblance';
import type { Semblance } from '#structures/Semblance';
import type {
  GuildMember,
  MessageComponentInteraction,
  Interaction,
  ContextMenuInteraction,
  AutocompleteInteraction,
} from 'discord.js';
import { Constants } from 'discord.js';
const { Events } = Constants;

export default {
  name: Events.INTERACTION_CREATE,
  exec: (interaction, client) => interactionCreate(interaction, client),
} as EventHandler<'interactionCreate'>;

export const interactionCreate = async (interaction: Interaction, client: Semblance) => {
  if (interaction.isAutocomplete()) return autocompleteInteraction(client, interaction);
  if (interaction.isMessageComponent()) return componentInteraction(client, interaction);
  if (interaction.isContextMenu()) return contextMenuInteraction(client, interaction);
  if (!interaction.isCommand()) return;

  if (!client.slashCommands.has(interaction.commandName))
    return interaction.reply("I can't find a command for this, something is borked.");
  const cmd = client.slashCommands.get(interaction.commandName);

  if (cmd.permissionRequired > getPermissionLevel(interaction.member as GuildMember))
    return interaction.reply("You don't have permission to use this command.");

  await client.slashCommands.get(interaction.commandName).run(interaction, {
    client,
    options: interaction.options,
    permissionLevel: getPermissionLevel(interaction.member as GuildMember),
  });
};

async function componentInteraction(client: Semblance, interaction: MessageComponentInteraction) {
  if ((Date.now() - interaction.createdTimestamp) / 1000 > 300) {
    disableAllComponents(interaction);
    return interaction.reply({
      content: 'This component has exceeded its lifespan and has been disabled.',
      ephemeral: true,
    });
  }

  let data: CustomIdData;
  if (interaction.customId.match(properCustomIdRegex)) data = JSON.parse(interaction.customId);
  else if (interaction.customId.match(customIdRegex)) data = eval(`(${interaction.customId})`);
  else
    return console.log(
      `Detected oddly received custom Id from a button:\nCustom Id: \n${interaction.customId}\nuser Id: ${interaction.user.id}`,
    );
  if (!client.componentHandlers.has(data.command)) return;
  const componentHandler = client.componentHandlers.get(data.command);
  if (interaction.user.id != data.id && !componentHandler.allowOthers)
    return await interaction.reply({
      content: "This command wasn't called by you so you can't use it",
      ephemeral: true,
    });
  if (interaction.isButton())
    return componentHandler.buttonHandle(interaction, data, {
      client,
      permissionLevel: getPermissionLevel(interaction.member as GuildMember),
    });
  if (interaction.isSelectMenu())
    componentHandler.selectHandle(interaction, data, {
      client,
      permissionLevel: getPermissionLevel(interaction.member as GuildMember),
    });
}

const contextMenuInteraction = async (client: Semblance, interaction: ContextMenuInteraction) => {
  if (!client.contextMenuHandlers.has(interaction.commandName)) return;
  const contextMenuHandler = client.contextMenuHandlers.get(interaction.commandName);
  contextMenuHandler.run(interaction, {
    options: interaction.options,
    permissionLevel: getPermissionLevel(interaction.member as GuildMember),
  });
};

const autocompleteInteraction = async (client: Semblance, interaction: AutocompleteInteraction) => {
  if (!client.autocompleteHandlers.has(interaction.commandName)) return;
  const autocompleteHandler = client.autocompleteHandlers.get(interaction.commandName);
  autocompleteHandler.run(interaction, interaction.options, client);
};
