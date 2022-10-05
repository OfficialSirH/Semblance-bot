import { Category, GuildId } from '#constants/index';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { exec } from 'child_process';
import {
  type ChatInputCommandInteraction,
  EmbedBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} from 'discord.js';

export default class Exec extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'exec',
      description: 'Executes a command in the terminal.',
      fullCategory: [Category.developer],
      preconditions: ['OwnerOnly'],
    });
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.deferReply();
    const embed = new EmbedBuilder();
    exec(interaction.options.getString('input'), (error, stdout, stderr) => {
      if (error) embed.setDescription(`\`\`\`js\n${error}\`\`\``);
      if (stderr) embed.setDescription(`\`\`\`js\n${stderr}\`\`\``);
      else embed.setDescription(`\`\`\`ansi\n${stdout}\`\`\``);
      return interaction.editReply({ embeds: [embed] });
    });
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        default_member_permissions: PermissionFlagsBits.Administrator.toString(),
        options: [
          {
            name: 'input',
            description: 'The command to execute.',
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        guildIds: [GuildId.cellToSingularity],
      },
    );
  }
}
