import { type CommandInteraction, MessageEmbed, MessageAttachment, Util } from 'discord.js';
import { Categories, randomColor } from '#constants/index';
import type { ApplicationCommandRegistry } from '@sapphire/framework';
import { Command } from '@sapphire/framework';
import { c2sGuildId, sirhGuildId } from '#config';
import { Constants } from 'discord.js';

export default class Edit extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'info-editor',
      description: 'edit information on commands that has ever-changing information',
      fullCategory: [Categories.developer],
      preconditions: ['OwnerOnly'],
    });
  }

  public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
    if (interaction.options.getSubcommandGroup(false) == 'boostercodes') {
      const subCommand = interaction.options.getSubcommand();

      if (subCommand == 'add') {
        const codes = interaction.options.getString('codes').replaceAll(' ', '').split(',');
        return this.addBoosterCode(interaction, codes);
      }

      if (subCommand == 'remove') {
        const codes = interaction.options.getString('codes').replaceAll(' ', '').split(',');
        return this.removeBoosterCode(interaction, codes);
      }

      if (subCommand == 'list') return this.listBoosterCodes(interaction);

      return interaction.reply('Invalid subcommand');
    }

    const subject = async () => {
      const subject = await this.container.client.db.information.findUnique({
        where: {
          type: interaction.options.getString('subject'),
        },
      });
      return subject ? subject : interaction.reply('Invalid subject.');
    };

    if (interaction.options.getSubcommand() == 'edit') {
      const subjectValue = await subject();
      if (!subjectValue) return;

      const embed = new MessageEmbed()
        .setTitle(`Editing ${subjectValue.type}`)
        .setDescription(
          `**Original values:**\`\`\`\n${Util.escapeCodeBlock(
            `Primary value: ${subjectValue.value}\nFooter: ${subjectValue.footer}\nExpired: ${subjectValue.expired}`,
          )}\`\`\``,
        );

      const updatedSubject = await this.container.client.db.information.update({
        where: {
          type: subjectValue.type,
        },
        data: {
          value: interaction.options.getString('value') || subjectValue.value,
          footer: interaction.options.getString('footer') || subjectValue.footer,
          expired:
            subjectValue.type == 'codes' ? interaction.options.getString('expired') || subjectValue.expired : null,
        },
      });

      if (!updatedSubject) return interaction.reply('Could not update information.');

      embed.setDescription(
        embed.description +
          `\n\n**Updated values:**\`\`\`\n${Util.escapeCodeBlock(
            `Primary value: ${updatedSubject.value}\nFooter: ${updatedSubject.footer}\nExpired: ${updatedSubject.expired}`,
          )}\`\`\``,
      );

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const subjectValue = await subject();
    if (!subjectValue) return;

    const embed = new MessageEmbed()
      .setTitle(subjectValue.type)
      .setColor(randomColor)
      .setThumbnail(this.container.client.user.displayAvatarURL())
      .setDescription('The following JSON for the info is in the file attached');

    const file = new MessageAttachment(Buffer.from(JSON.stringify(subjectValue)), `${subjectValue.type}.json`);

    return interaction.reply({ embeds: [embed], files: [file], ephemeral: true });
  }

  public override async registerApplicationCommands(registry: ApplicationCommandRegistry) {
    const infoSubjects = (
      await this.container.client.db.information.findMany({
        select: {
          type: true,
        },
      })
    ).map(i => ({ name: i.type, value: i.type }));

    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        defaultPermission: false,
        options: [
          {
            name: 'edit',
            description: 'take upon the edit action',
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options: [
              {
                name: 'subject',
                description: 'the information to edit',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                choices: infoSubjects,
                required: true,
              },
              {
                name: 'value',
                description: 'the new value',
                type: Constants.ApplicationCommandOptionTypes.STRING,
              },
              {
                name: 'footer',
                description: 'the new footer',
                type: Constants.ApplicationCommandOptionTypes.STRING,
              },
              {
                name: 'expired',
                description: 'the new expired value',
                type: Constants.ApplicationCommandOptionTypes.STRING,
              },
            ],
          },
          {
            name: 'display',
            description: 'take upon the display action',
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options: [
              {
                name: 'subject',
                description: 'the information to display',
                type: Constants.ApplicationCommandOptionTypes.STRING,
                choices: infoSubjects,
                required: true,
              },
            ],
          },
          {
            name: 'boostercodes',
            description: 'interact with the booster codes',
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
            options: [
              {
                name: 'add',
                description: 'add codes',
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                options: [
                  {
                    name: 'codes',
                    description: 'the codes to add (comma separated)',
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    required: true,
                  },
                ],
              },
              {
                name: 'remove',
                description: 'remove codes',
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                options: [
                  {
                    name: 'codes',
                    description: 'the codes to remove (comma separated)',
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    required: true,
                  },
                ],
              },
              {
                name: 'list',
                description: 'list codes',
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
              },
            ],
          },
        ],
      },
      {
        guildIds: [c2sGuildId, sirhGuildId],
      },
    );
  }

  private async listBoosterCodes(interaction: CommandInteraction<'cached'>) {
    const darwiniumCodes = await interaction.client.db.boosterCodes.findMany({});
    const list = darwiniumCodes.length > 0 ? darwiniumCodes.map(c => c.code).join(', ') : 'None';
    const embed = new MessageEmbed()
      .setTitle('Booster Codes')
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setDescription(`number of codes: ${darwiniumCodes.length}\n\`\`\`\n${list}\`\`\``)
      .setColor(randomColor);
    interaction.reply({ embeds: [embed] });
  }

  private async addBoosterCode(interaction: CommandInteraction<'cached'>, codes: string[]) {
    if (codes.length == 0) return interaction.reply('You need to give me a code to add.');

    const darwiniumCodes = await interaction.client.db.boosterCodes.findMany({});
    if (codes.every(c => darwiniumCodes.map(code => code.code).includes(c)))
      return interaction.reply('All of the codes you provided are already in the list.');

    codes = codes.filter(c => !darwiniumCodes.map(code => code.code).includes(c));
    await interaction.client.db.boosterCodes.createMany({
      data: codes.map(c => ({ code: c })),
    });

    const list = darwiniumCodes.map(c => c.code).concat(codes);
    const embed = new MessageEmbed()
      .setTitle('Booster Codes')
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setDescription(
        `**The provided codes were successfully added**\nnew number of codes: ${list.length}\n\`\`\`\n${list.join(
          ', ',
        )}\`\`\``,
      )
      .setColor(randomColor);
    interaction.reply({ embeds: [embed] });
  }

  private async removeBoosterCode(interaction: CommandInteraction<'cached'>, codes: string[]) {
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

    const embed = new MessageEmbed()
      .setTitle('Booster Codes')
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setDescription(
        `**The provided codes were successfully removed**\nnew number of codes: ${
          filteredList.length
        }\n\`\`\`\n${filteredList.join(', ')}\`\`\``,
      )
      .setColor(randomColor);
    interaction.reply({ embeds: [embed] });
  }
}
