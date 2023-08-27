import { GuildId, Category, randomColor, PreconditionName, avatarUrl, authorDefault } from '#constants/index';
import { Attachy } from '#structures/Attachy';
import { Command } from '#structures/Command';
import type { InteractionOptionResolver } from '#structures/InteractionOptionResolver';
import { EmbedBuilder } from '@discordjs/builders';
import {
  type APIChatInputApplicationCommandGuildInteraction,
  ApplicationCommandOptionType,
  MessageFlags,
  PermissionFlagsBits,
  type RESTPostAPIApplicationCommandsJSONBody,
  type APIUser,
} from '@discordjs/core';
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

  public override async chatInputRun(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    if (options.getSubcommandGroup(false) == 'boostercodes') {
      const subCommand = options.getSubcommand();

      if (subCommand == 'add') {
        const codes = options.getString('codes', true).replaceAll(' ', '').split(',');
        return this.addBoosterCode(res, interaction, codes);
      }

      if (subCommand == 'remove') {
        const codes = options.getString('codes', true).replaceAll(' ', '').split(',');
        return this.removeBoosterCode(res, interaction, codes);
      }

      if (subCommand == 'list') return this.listBoosterCodes(res, interaction);

      return this.client.api.interactions.reply(res, { content: 'Invalid subcommand' });
    }

    const subject = async () => {
      const subject = await this.client.db.information.findUnique({
        where: {
          type: options.getString('subject', true),
        },
      });
      return subject ? subject : this.client.api.interactions.reply(res, { content: 'Invalid subject.' });
    };

    if (options.getSubcommand() == 'edit') {
      const subjectValue = await subject();
      if (!subjectValue) return;

      const embed = new EmbedBuilder()
        .setTitle(`Editing ${subjectValue.type}`)
        .setDescription(
          `**Original values:**\`\`\`\n${`Primary value: ${subjectValue.value}\nFooter: ${subjectValue.footer}\nExpired: ${subjectValue.expired}`.replaceAll(
            '```',
            '\\`\\`\\`',
          )}\`\`\``,
        );

      const updatedSubject = await this.client.db.information.update({
        where: {
          type: subjectValue.type,
        },
        data: {
          value: options.getString('value')?.replaceAll('\\n', '\n') || subjectValue.value,
          footer: options.getString('footer') || subjectValue.footer,
          expired: subjectValue.type == 'codes' ? options.getString('expired') || subjectValue.expired : null,
        },
      });

      if (!updatedSubject) return this.client.api.interactions.reply(res, { content: 'Could not update information.' });

      embed.setDescription(
        embed.data.description +
          `\n\n**Updated values:**\`\`\`\n${`Primary value: ${updatedSubject.value}\nFooter: ${updatedSubject.footer}\nExpired: ${updatedSubject.expired}`.replaceAll(
            '```',
            '\\`\\`\\`',
          )}\`\`\``,
      );

      return this.client.api.interactions.reply(res, { embeds: [embed.toJSON()], flags: MessageFlags.Ephemeral });
    }

    const subjectValue = await subject();
    if (!subjectValue) return;

    const embed = new EmbedBuilder()
      .setTitle(subjectValue.type)
      .setColor(randomColor)
      .setThumbnail(avatarUrl(this.client.user as APIUser))
      .setDescription('The following JSON for the info is in the file attached');

    const file = new Attachy(Buffer.from(JSON.stringify(subjectValue)), `${subjectValue.type}.json`);

    return this.client.api.interactions.reply(res, {
      embeds: [embed.toJSON()],
      files: [file],
      flags: MessageFlags.Ephemeral,
    });
  }

  public override async data() {
    const infoSubjects = (
      await this.client.db.information.findMany({
        select: {
          type: true,
        },
      })
    ).map(i => ({ name: i.type, value: i.type }));

    return {
      command: {
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
      } satisfies RESTPostAPIApplicationCommandsJSONBody,
      guildIds: [GuildId.cellToSingularity, GuildId.sirhStuff],
    };
  }

  public override async componentRun(reply: FastifyReply) {
    return this.client.api.interactions.reply(reply, {
      content: 'Not implemented yet.',
      flags: MessageFlags.Ephemeral,
    });
  }

  private async listBoosterCodes(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
    const darwiniumCodes = await this.client.db.boosterCodes.findMany({});
    const list = darwiniumCodes.length > 0 ? darwiniumCodes.map(c => c.code).join(', ') : 'None';
    const embed = new EmbedBuilder()
      .setTitle('Booster Codes')
      .setAuthor(authorDefault(interaction.member.user))
      .setDescription(`number of codes: ${darwiniumCodes.length}\n\`\`\`\n${list}\`\`\``)
      .setColor(randomColor);
    this.client.api.interactions.reply(res, { embeds: [embed.toJSON()] });
  }

  private async addBoosterCode(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    codes: string[],
  ) {
    if (codes.length == 0)
      return this.client.api.interactions.reply(res, { content: 'You need to give me a code to add.' });

    const darwiniumCodes = await this.client.db.boosterCodes.findMany({});
    if (codes.every(c => darwiniumCodes.map(code => code.code).includes(c)))
      return this.client.api.interactions.reply(res, {
        content: 'All of the codes you provided are already in the list.',
      });

    codes = codes.filter(c => !darwiniumCodes.map(code => code.code).includes(c));
    await this.client.db.boosterCodes.createMany({
      data: codes.map(c => ({ code: c })),
    });

    const list = darwiniumCodes.map(c => c.code).concat(codes);
    const embed = new EmbedBuilder()
      .setTitle('Booster Codes')
      .setAuthor(authorDefault(interaction.member.user))
      .setDescription(
        `**The provided codes were successfully added**\nnew number of codes: ${list.length}\n\`\`\`\n${list.join(
          ', ',
        )}\`\`\``,
      )
      .setColor(randomColor);
    this.client.api.interactions.reply(res, { embeds: [embed.toJSON()] });
  }

  private async removeBoosterCode(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    codes: string[],
  ) {
    if (codes.length == 0)
      return this.client.api.interactions.reply(res, { content: 'You need to give me a code to remove.' });

    const darwiniumCodes = await this.client.db.boosterCodes.findMany({});
    if (codes.every(c => !darwiniumCodes.map(code => code.code).includes(c)))
      return this.client.api.interactions.reply(res, { content: "All of the codes you provided aren't in the list." });

    codes = codes.filter(c => darwiniumCodes.map(c => c.code).includes(c));
    const filteredList = darwiniumCodes.filter(c => !codes.includes(c.code)).map(c => c.code);

    await this.client.db.boosterCodes.deleteMany({
      where: {
        code: {
          in: codes,
        },
      },
    });

    const embed = new EmbedBuilder()
      .setTitle('Booster Codes')
      .setAuthor(authorDefault(interaction.member.user))
      .setDescription(
        `**The provided codes were successfully removed**\nnew number of codes: ${
          filteredList.length
        }\n\`\`\`\n${filteredList.join(', ')}\`\`\``,
      )
      .setColor(randomColor);
    this.client.api.interactions.reply(res, { embeds: [embed.toJSON()] });
  }
}
