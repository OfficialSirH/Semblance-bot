import { c2sGuildId } from '#config';
import { Categories } from '#constants/index';
import { ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { exec } from 'child_process';
import { CommandInteraction, MessageEmbed } from 'discord.js';

export default class Exec extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'exec',
      description: 'Executes a command in the terminal.',
      fullCategory: [Categories.developer],
      preconditions: ['OwnerOnly'],
    });
  }

  public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
    await interaction.deferReply();
    const embeds = [new MessageEmbed()];
    exec(interaction.options.getString('input'), (error, stdout, stderr) => {
      if (error) embeds[0].setDescription(`\`\`\`js\n${error}\`\`\``);
      if (stderr) embeds[0].setDescription(`\`\`\`js\n${stderr}\`\`\``);
      else embeds[0].setDescription(`\`\`\`ansi\n${stdout}\`\`\``);
      return interaction.editReply({ embeds });
    });
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        defaultPermission: false,
        options: [
          {
            name: 'input',
            description: 'The command to execute.',
            type: 'STRING',
            required: true,
          },
        ],
      },
      {
        guildIds: [c2sGuildId],
      },
    );
  }
}
