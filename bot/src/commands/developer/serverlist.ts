import { randomColor, guildBookPage, Category, GuildId, PreconditionName, avatarUrl } from '#constants/index';
import { Command } from '#structures/Command';
import { serversPerPage } from '#constants/commands';
import { buildCustomId } from '#constants/components';
import {
  ButtonStyle,
  ApplicationCommandOptionType,
  type APIChatInputApplicationCommandGuildInteraction,
  type RESTPostAPIApplicationCommandsJSONBody,
  type APIUser,
  type APIMessageComponentButtonInteraction,
} from '@discordjs/core';
import {
  ActionRowBuilder,
  type MessageActionRowComponentBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from '@discordjs/builders';
import type { FastifyReply } from 'fastify';
import type { InteractionOptionResolver } from '#structures/InteractionOptionResolver';
import type { ParsedCustomIdData, CustomIdData } from '#lib/interfaces/Semblance';

export default class ServerList extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'serverlist',
      description: 'Lists all servers that Semblance is in.',
      fullCategory: [Category.developer],
      preconditions: [PreconditionName.OwnerOnly],
      componentParseOptions: {
        extraProps: {
          page: 'number',
        },
      },
    });
  }

  public override async chatInputRun(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const page = options.getInteger('page') || 1;

    const { chosenPage, pageDetails } = guildBookPage(this.client, page);
    const numOfPages = Math.ceil(this.client.cache.data.guilds.size / serversPerPage);

    const components = [
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel('First Page')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(chosenPage === 1)
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'first',
                id: interaction.member.user.id,
                page: chosenPage,
              }),
            ),
          new ButtonBuilder()
            .setLabel('Left')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji({ name: '⬅' })
            .setDisabled(chosenPage === 1)
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'left',
                id: interaction.member.user.id,
                page: chosenPage,
              }),
            ),
          new ButtonBuilder()
            .setLabel('Right')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji({ name: '➡' })
            .setDisabled(chosenPage === numOfPages)
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'right',
                id: interaction.member.user.id,
                page: chosenPage,
              }),
            ),
          new ButtonBuilder()
            .setLabel('Last Page')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(chosenPage === numOfPages)
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'last',
                id: interaction.member.user.id,
                page: chosenPage,
              }),
            ),
        ),
      ].map(row => row.toJSON()),
      embed = new EmbedBuilder()
        .setTitle(`Server List [${this.client.cache.data.guilds.size}] - Page ${chosenPage}`)
        .setColor(randomColor)
        .setThumbnail(avatarUrl(this.client.user as APIUser))
        .setDescription(pageDetails)
        .setFooter({ text: `Page ${chosenPage} out of ${numOfPages}` });

    await this.client.api.interactions.reply(res, { embeds: [embed.toJSON()], components });
  }

  public override data() {
    return {
      command: {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'page',
            description: 'The page number to view.',
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
        ],
      } satisfies RESTPostAPIApplicationCommandsJSONBody,
      guildIds: [GuildId.sirhStuff],
    };
  }

  public override async componentRun(
    reply: FastifyReply,
    interaction: APIMessageComponentButtonInteraction,
    data: ParsedCustomIdData<'left' | 'right' | 'first' | 'last', ServerListCustomIdData>,
  ) {
    const { client, user } = interaction;
    let page = data.page;
    const numOfPages = Math.ceil(client.guilds.cache.size / serversPerPage);

    if (data.action == 'left') page--;
    else if (data.action == 'right') page++;
    else if (data.action == 'first') page = 1;
    else page = numOfPages;

    const { chosenPage, pageDetails } = guildBookPage(client, page);

    const components = [
        new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel('First Page')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(chosenPage === 1)
            .setCustomId(
              buildCustomId({
                command: 'serverlist',
                action: 'first',
                id: user.id,
                page,
              }),
            ),
          new ButtonBuilder()
            .setLabel('Left')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji({ name: '⬅' })
            .setDisabled(chosenPage === 1)
            .setCustomId(
              buildCustomId({
                command: 'serverlist',
                action: 'left',
                id: user.id,
                page,
              }),
            ),
          new ButtonBuilder()
            .setLabel('Right')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji({ name: '➡' })
            .setDisabled(chosenPage === numOfPages)
            .setCustomId(
              buildCustomId({
                command: 'serverlist',
                action: 'right',
                id: user.id,
                page,
              }),
            ),
          new ButtonBuilder()
            .setLabel('Last Page')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(chosenPage === numOfPages)
            .setCustomId(
              buildCustomId({
                command: 'serverlist',
                action: 'last',
                id: user.id,
                page,
              }),
            ),
        ),
      ],
      embed = new EmbedBuilder()
        .setTitle(`Server List [${client.guilds.cache.size}] - Page ${chosenPage}`)
        .setColor(randomColor)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(pageDetails)
        .setFooter({ text: `Page ${chosenPage} out of ${numOfPages}` });
    await client.api.interactions.updateMessage(reply, { embeds: [embed.toJSON()], components });
  }
}

interface ServerListCustomIdData extends CustomIdData {
  page: number;
}
