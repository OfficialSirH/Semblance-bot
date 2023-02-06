import { Category, disableAllComponents, randomColor } from '#constants/index';
import { Command } from '#structures/Command';
import { backButton, buildCustomId, closeButton } from '#constants/components';
import {
  EmbedBuilder,
  chatInputApplicationCommandMention,
  ActionRowBuilder,
  type MessageActionRowComponentBuilder,
  ButtonBuilder,
  SelectMenuBuilder,
} from '@discordjs/builders';
import {
  ButtonStyle,
  ApplicationCommandOptionType,
  type APIChatInputApplicationCommandGuildInteraction,
  type RESTPostAPIApplicationCommandsJSONBody,
  type APIApplicationCommandAutocompleteGuildInteraction,
  MessageFlags,
  type APIMessageComponentButtonInteraction,
  type APISelectMenuComponent,
  type APIMessageComponent,
  type APIMessageComponentInteraction,
  ComponentType,
  type APIStringSelectComponent,
  type APIMessageComponentSelectMenuInteraction,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';
import type { InteractionOptionResolver } from '#structures/InteractionOptionResolver';
import type { ParsedCustomIdData } from '#lib/interfaces/Semblance';

export default class Help extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'help',
      description: 'Lists all available commands.',
      fullCategory: [Category.help],
    });
  }

  public override templateRun(interaction: APIChatInputApplicationCommandGuildInteraction) {
    const user = interaction.member.user;

    const c2sServerCommands = this.client.cache.handles.commands
      .filter(c => c.category === Category.c2sServer)
      .map(c => `**${c.name}**`);
    const embed = new EmbedBuilder()
      .setTitle('Semblance Command List')
      .setColor(randomColor)
      .setDescription(
        `All of the available commands below can be found through the ${chatInputApplicationCommandMention(
          'help',
          this.client.cache.data.applicationCommands.find(c => c.name === 'help')?.id as string,
        )} command via the \`query\` option.`,
      )
      .addFields(
        {
          name: '**-> Cell to Singularity Server Commands**',
          value: c2sServerCommands.join(', '),
          inline: true,
        },
        {
          name: '**-> Slash Commands**',
          value: [
            "Semblance's Slash Commands can be listed by typing `/`, which if none are visible,",
            "that's likely due to Semblance not being authorized on the server and a admin will need to click",
            `[here](https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=274878295040&scope=bot+applications.commands) to authorize Semblance.`,
          ].join(' '),
        },
      );
    const components = [
      new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(
              buildCustomId({
                command: 'help',
                action: 'c2shelp',
                id: user.id,
              }),
            )
            .setLabel('Cell to Singularity Help')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(
              buildCustomId({
                command: 'help',
                action: 'mischelp',
                id: user.id,
              }),
            )
            .setLabel('Miscellaneous Help')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId(
              buildCustomId({
                command: 'help',
                action: 'close',
                id: user.id,
              }),
            )
            .setLabel('Close')
            .setEmoji({ name: '🚫' })
            .setStyle(ButtonStyle.Secondary),
        )
        .toJSON(),
    ];

    return {
      embeds: [embed.toJSON()],
      components,
    };
  }

  public override async chatInputRun(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const query = options.getString('query');
    if (!query) return this.client.api.interactions.reply(res, this.templateRun(interaction));

    const commands = this.client.cache.handles.commands.filter(c => 'templateRun' in c);

    if (!commands.has(query)) {
      const possibleQueries = commands.map(i => i.name);
      const components = possibleQueries
        .reduce((acc, cur, i) => {
          const index = Math.floor(i / 25);
          if (!acc[index])
            acc[index] = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
              new SelectMenuBuilder()
                .setCustomId(
                  buildCustomId({
                    command: 'help',
                    action: `query-${index}`,
                    id: interaction.member.user.id,
                  }),
                )
                .setPlaceholder('Select a query'),
            );
          (acc[index].components[0] as SelectMenuBuilder).addOptions({ label: cur, value: cur });
          return acc;
        }, [] as ActionRowBuilder<MessageActionRowComponentBuilder>[])
        .map(i => i.toJSON());
      return this.client.api.interactions.reply(res, {
        embeds: [
          new EmbedBuilder()
            .setTitle('Help')
            .setDescription(
              "Due to an invalid query, here's a provided list from Semblance's help command in the dropdowns below.",
            )
            .toJSON(),
        ],
        components,
      });
    }

    const info = (await commands.get(query)?.templateRun?.(interaction)) ?? {
      content: 'failed to retrieve info for query',
    };
    await this.client.api.interactions.reply(res, info);
  }

  public override autocompleteRun(
    res: FastifyReply,
    interaction: APIApplicationCommandAutocompleteGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const query = options.getFocused() as string;

    const queriedInfoStartsWith = this.client.cache.handles.commands
      .filter(i => 'templateRun' in i && i.name.startsWith(query))
      .map(i => ({ name: i.name, value: i.name }))
      .slice(0, 25);
    const queriedInfoContains = this.client.cache.handles.commands
      .filter(i => 'templateRun' in i && !i.name.startsWith(query) && i.name.includes(query))
      .map(i => ({ name: i.name, value: i.name }))
      .slice(0, 25 - queriedInfoStartsWith.length);

    if (queriedInfoStartsWith.length == 0 && queriedInfoContains.length == 0) return;

    return this.client.api.interactions.autocomplete(res, [...queriedInfoStartsWith, ...queriedInfoContains]);
  }

  public override data() {
    return {
      command: {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'query',
            description: 'The query to search for.',
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
          },
        ],
      } satisfies RESTPostAPIApplicationCommandsJSONBody,
    };
  }

  public override async componentRun(
    reply: FastifyReply,
    interaction: APIMessageComponentInteraction,
    data: ParsedCustomIdData<
      'c2shelp' | 'mischelp' | 'metabits' | 'mesoguide' | 'largenumbers' | 'metahelp' | 'itemhelp' | 'help' | 'close'
    >,
  ) {
    if (interaction.data.component_type === ComponentType.Button) return this.buttonRun(reply, interaction as APIMessageComponentButtonInteraction, data);
    if (interaction.data.component_type === ComponentType.StringSelect) return this.selectMenuRun(reply, interaction as APIMessageComponentSelectMenuInteraction);
  }

  public async selectMenuRun(reply: FastifyReply, interaction: APIMessageComponentSelectMenuInteraction) {
    const query = interaction.values[0];

    await disableAllComponents(interaction);

    if (!this.this.client.cache.handles.commands.has(query))
      return this.client.api.interactions.reply(res, { content: 'Invalid query.', flags: MessageFlags.Ephemeral });

    // @ts-expect-error - I already checked if the command exists just above, but TS doesn't know that
    const info = await this.this.client.cache.handles.commands.get(query).templateRun(interaction);

    return this.client.api.interactions.reply(res, info);
  }

  public async buttonRun(
    reply: FastifyReply,
    interaction: APIMessageComponentButtonInteraction,
    data: ParsedCustomIdData<
      'c2shelp' | 'mischelp' | 'metabits' | 'mesoguide' | 'largenumbers' | 'metahelp' | 'itemhelp' | 'help' | 'close'
    >,
  ) {
    const client = this.client;
    const components = [new ActionRowBuilder<MessageActionRowComponentBuilder>()];
    if (data.action != 'help')
      components
        .at(0)
        ?.components.push(
          backButton('help', interaction.member.user.id, 'help'),
          closeButton('help', interaction.member.user.id),
        );

    let options: string | InteractionReplyOptions | undefined;
    switch (data.action) {
      // Main Help Page
      case 'c2shelp':
        // @ts-expect-error - complains about an attempt to invoke a possibly undefined object despite optional chaining
        options = await this.client.cache.handles.commands.get('c2shelp')?.templateRun(interaction);
        break;
      case 'mischelp':
        // @ts-expect-error - complains about an attempt to invoke a possibly undefined object despite optional chaining
        options = await this.client.cache.handles.commands.get('mischelp')?.templateRun(interaction);
        break;
      // Cell to Singularity Help Page
      case 'metabits':
        // @ts-expect-error - complains about an attempt to invoke a possibly undefined object despite optional chaining
        options = await this.client.cache.handles.commands.get('metabits')?.templateRun(interaction);
        break;
      case 'mesoguide':
        // @ts-expect-error - complains about an attempt to invoke a possibly undefined object despite optional chaining
        options = await this.client.cache.handles.commands.get('mesoguide')?.templateRun(interaction);
        break;
      // Calculator Help Page
      case 'largenumbers':
        // @ts-expect-error - complains about an attempt to invoke a possibly undefined object despite optional chaining
        options = await this.client.cache.handles.commands.get('largenumbers')?.templateRun(interaction);
        break;
      case 'metahelp':
        // @ts-expect-error - complains about an attempt to invoke a possibly undefined object despite optional chaining
        options = await this.client.cache.handles.commands.get('metahelp')?.templateRun(interaction);
        break;
      case 'itemhelp':
        // @ts-expect-error - complains about an attempt to invoke a possibly undefined object despite optional chaining
        options = await this.client.cache.handles.commands.get('itemhelp')?.templateRun(interaction);
        break;
      // Back and Close Actions
      case 'help':
        // @ts-expect-error - complains about an attempt to invoke a possibly undefined object despite optional chaining
        options = await this.client.cache.handles.commands.get('help')?.templateRun(interaction);
        break;
      case 'close':
        return interaction.channel?.messages.delete(interaction.message.id);
      default:
        return this.client.api.interactions.reply(res, { content: 'Invalid action.', flags: MessageFlags.Ephemeral });
    }

    if (!options)
      return this.client.api.interactions.reply(res, { content: 'Invalid action.', flags: MessageFlags.Ephemeral });
    if (typeof options != 'string') {
      if (options.components)
        (options.components?.at(0) as ActionRowData<MessageActionRowComponentData>).components.push(
          ...(components.at(0) as ActionRowBuilder<MessageActionRowComponentBuilder>).components,
        );
      else options.components = components;
      options.files = [];
    }
    return client.api.interactions.updateMessage(reply, (options as InteractionUpdateOptions);
  }
}
