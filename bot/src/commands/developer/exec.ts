import { Category, GuildId, PreconditionName } from '#constants/index';
import { Command } from '#structures/Command';
import {
  type APIApplicationCommandInteraction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} from '@discordjs/core';
import { exec } from 'child_process';
import type { FastifyReply } from 'fastify';

export default class Exec extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'exec',
      description: 'Executes a command in the terminal.',
      category: [Category.developer],
      preconditions: [PreconditionName.OwnerOnly],
    });
  }

  public override async chatInputRun(res: FastifyReply, interaction: APIApplicationCommandInteraction) {
    await interaction.deferReply();
    const embed = new EmbedBuilder();
    exec(interaction.options.getString('input', true), (error, stdout, stderr) => {
      if (error) embed.setDescription(`\`\`\`js\n${error}\`\`\``);
      if (stderr) embed.setDescription(`\`\`\`js\n${stderr}\`\`\``);
      else embed.setDescription(`\`\`\`ansi\n${stdout}\`\`\``);
      return interaction.editReply({ embeds: [embed] });
    });
  }

  public override data() {
    return {
      command: {
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
      guildIds: [GuildId.cellToSingularity],
    };
  }
}
