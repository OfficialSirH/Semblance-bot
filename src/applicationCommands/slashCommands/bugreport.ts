/* eslint-disable @typescript-eslint/no-unused-vars */
import type { SlashCommand } from '#lib/interfaces/Semblance';
import { CommandInteraction } from 'discord.js';

export default {
  permissionRequired: 0,
  run: async interaction => {
    return interaction.reply({
      content:
        "This command has not been implemented yet, lots of sweat and hard work is being put into this command as it's a pain in the butt to make perfect.",
      ephemeral: true,
    });
    let action: string, commandFailed: boolean;
    try {
      action = interaction.options.getSubcommand(true);
    } catch (e) {
      commandFailed = true;
      interaction.reply({
        content: 'You must specify a subcommand.',
        ephemeral: true,
      });
    }
    if (commandFailed) return;
    switch (action) {
      case 'report':
        return report(interaction);
      case 'attach':
        return attach(interaction);
      case 'reproduce':
        return reproduce(interaction);
      default:
        return interaction.reply({
          content: 'You must specify a valid subcommand.',
          ephemeral: true,
        });
    }
  },
} as SlashCommand;

function report(interaction: CommandInteraction): void | PromiseLike<void> {
  throw new Error('Function not implemented.');
}

function attach(interaction: CommandInteraction): void | PromiseLike<void> {
  throw new Error('Function not implemented.');
}

function reproduce(interaction: CommandInteraction): void | PromiseLike<void> {
  throw new Error('Function not implemented.');
}
