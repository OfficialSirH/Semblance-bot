import { GuildId, Category, randomColor, PreconditionName } from '#constants/index';
import { Command } from '#structures/Command';
import { ApplicationCommandOptionType, PermissionFlagsBits } from '@discordjs/core';
import type { ApplicationCommandRegistry } from '@sapphire/framework';
import type { FastifyReply } from 'fastify';

export default class InfoEditor extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'info-editor',
      description: 'edit information on commands that has ever-changing information',
      fullCategory: [Category.developer],
      preconditions: [PreconditionName.OwnerOnly],
    });
  }

  public override async chatInputRun(res: FastifyReply, interaction: APIApplicationCommandInteraction) {
    if (interaction.options.getSubcommandGroup(false) == 'boostercodes') {
      const subCommand = interaction.options.getSubcommand();

      if (subCommand == 'add') {
        const codes = interaction.options.getString('codes', true).replaceAll(' ', '').split(',');
        return this.addBoosterCode(interaction, codes);
      }

      if (subCommand == 'remove') {
        const codes = interaction.options.getString('codes', true).replaceAll(' ', '').split(',');
        return this.removeBoosterCode(interaction, codes);
      }

      if (subCommand == 'list') return this.listBoosterCodes(interaction);

      return interaction.reply('Invalid subcommand');
    }

    const subject = async () => {
      const subject = await this.client.db.information.findUnique({
        where: {
          type: interaction.options.getString('subject', true),
        },
      });
      return subject ? subject : interaction.reply('Invalid subject.');
    };

    if (interaction.options.getSubcommand() == 'edit') {
      const subjectValue = await subject();
      if (!('type' in subjectValue)) return;

      const embed = new EmbedBuilder()
        .setTitle(`Editing ${subjectValue.type}`)
        .setDescription(
          `**Original values:**\`\`\`\n${escapeCodeBlock(
            `Primary value: ${subjectValue.value}\nFooter: ${subjectValue.footer}\nExpired: ${subjectValue.expired}`,
          )}\`\`\``,
        );

      const updatedSubject = await this.client.db.information.update({
        where: {
          type: subjectValue.type,
        },
        data: {
          value: interaction.options.getString('value')?.replaceAll('\\n', '\n') || subjectValue.value,
          footer: interaction.options.getString('footer') || subjectValue.footer,
          expired:
            subjectValue.type == 'codes' ? interaction.options.getString('expired') || subjectValue.expired : null,
        },
      });

      if (!updatedSubject) return interaction.reply('Could not update information.');

      embed.setDescription(
        embed.data.description +
          `\n\n**Updated values:**\`\`\`\n${escapeCodeBlock(
            `Primary value: ${updatedSubject.value}\nFooter: ${updatedSubject.footer}\nExpired: ${updatedSubject.expired}`,
          )}\`\`\``,
      );

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const subjectValue = await subject();
    if (!('type' in subjectValue)) return;

    const embed = new EmbedBuilder()
      .setTitle(subjectValue.type)
      .setColor(randomColor)
      .setThumbnail(this.client.user?.displayAvatarURL() as string)
      .setDescription('The following JSON for the info is in the file attached');

    const file = new Attachy(Buffer.from(JSON.stringify(subjectValue)), {
      name: `${subjectValue.type}.json`,
    });

    return interaction.reply({ embeds: [embed], files: [file], ephemeral: true });
  }

  public override async registerApplicationCommands(registry: ApplicationCommandRegistry) {
    const infoSubjects = (
      await this.client.db.information.findMany({
        select: {
          type: true,
        },
      })
    ).map(i => ({ name: i.type, value: i.type }));

    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        default_member_permissions: PermissionFlagsBits.Administrator.toString(),
        options: [
          {
            name: 'subjects',
            description: 'manage subjects/information',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
              {
                name: 'edit',
                description: 'take upon the edit action',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                  {
                    name: 'subject',
                    description: 'the information to edit',
                    type: ApplicationCommandOptionType.String,
                    choices: infoSubjects,
                    required: true,
                  },
                  {
                    name: 'value',
                    description: 'the new value',
                    type: ApplicationCommandOptionType.String,
                  },
                  {
                    name: 'footer',
                    description: 'the new footer',
                    type: ApplicationCommandOptionType.String,
                  },
                  {
                    name: 'expired',
                    description: 'the new expired value',
                    type: ApplicationCommandOptionType.String,
                  },
                ],
              },
              {
                name: 'display',
                description: 'take upon the display action',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                  {
                    name: 'subject',
                    description: 'the information to display',
                    type: ApplicationCommandOptionType.String,
                    choices: infoSubjects,
                    required: true,
                  },
                ],
              },
            ],
          },
          {
            name: 'boostercodes',
            description: 'interact with the booster codes',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
              {
                name: 'add',
                description: 'add codes',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                  {
                    name: 'codes',
                    description: 'the codes to add (comma separated)',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                  },
                ],
              },
              {
                name: 'remove',
                description: 'remove codes',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                  {
                    name: 'codes',
                    description: 'the codes to remove (comma separated)',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                  },
                ],
              },
              {
                name: 'list',
                description: 'list codes',
                type: ApplicationCommandOptionType.Subcommand,
              },
            ],
          },
        ],
      },
      {
        guildIds: [GuildId.cellToSingularity, GuildId.sirhStuff],
      },
    );
  }

  private async listBoosterCodes(interaction: APIApplicationCommandInteraction) {
    const darwiniumCodes = await interaction.client.db.boosterCodes.findMany({});
    const list = darwiniumCodes.length > 0 ? darwiniumCodes.map(c => c.code).join(', ') : 'None';
    const embed = new EmbedBuilder()
      .setTitle('Booster Codes')
      .setAuthor(interaction.user)
      .setDescription(`number of codes: ${darwiniumCodes.length}\n\`\`\`\n${list}\`\`\``)
      .setColor(randomColor);
    interaction.reply({ embeds: [embed] });
  }

  private async addBoosterCode(interaction: APIApplicationCommandInteraction, codes: string[]) {
    if (codes.length == 0) return interaction.reply('You need to give me a code to add.');

    const darwiniumCodes = await interaction.client.db.boosterCodes.findMany({});
    if (codes.every(c => darwiniumCodes.map(code => code.code).includes(c)))
      return interaction.reply('All of the codes you provided are already in the list.');

    codes = codes.filter(c => !darwiniumCodes.map(code => code.code).includes(c));
    await interaction.client.db.boosterCodes.createMany({
      data: codes.map(c => ({ code: c })),
    });

    const list = darwiniumCodes.map(c => c.code).concat(codes);
    const embed = new EmbedBuilder()
      .setTitle('Booster Codes')
      .setAuthor(interaction.user)
      .setDescription(
        `**The provided codes were successfully added**\nnew number of codes: ${list.length}\n\`\`\`\n${list.join(
          ', ',
        )}\`\`\``,
      )
      .setColor(randomColor);
    interaction.reply({ embeds: [embed] });
  }

  private async removeBoosterCode(interaction: APIApplicationCommandInteraction, codes: string[]) {
    if (codes.length == 0) return interaction.reply('You need to give me a code to remove.');

    const darwiniumCodes = await interaction.client.db.boosterCodes.findMany({});
    if (codes.every(c => !darwiniumCodes.map(code => code.code).includes(c)))
      return interaction.reply("All of the codes you provided aren't in the list.");

    codes = codes.filter(c => darwiniumCodes.map(c => c.code).includes(c));
    const filteredList = darwiniumCodes.filter(c => !codes.includes(c.code)).map(c => c.code);

    await interaction.client.db.boosterCodes.deleteMany({
      where: {
        code: {
          in: codes,
        },
      },
    });

    const embed = new EmbedBuilder()
      .setTitle('Booster Codes')
      .setAuthor(interaction.user)
      .setDescription(
        `**The provided codes were successfully removed**\nnew number of codes: ${
          filteredList.length
        }\n\`\`\`\n${filteredList.join(', ')}\`\`\``,
      )
      .setColor(randomColor);
    interaction.reply({ embeds: [embed] });
  }
}
