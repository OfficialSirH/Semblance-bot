import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  type ChatInputCommandInteraction,
  SelectMenuBuilder,
  type AutocompleteInteraction,
  ApplicationCommandOptionType,
  ButtonStyle,
  type MessageActionRowComponentBuilder,
} from 'discord.js';
import { applicationCommandToMention, Category, randomColor } from '#constants/index';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';
import { buildCustomId } from '#constants/components';

export default class Help extends Command {
  public override name = 'help';
  public override description = 'Lists all available commands.';
  public override fullCategory = [Category.help];

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const { user, client } = interaction;
    const c2sServerCommands = interaction.client.stores
      .get('commands')
      .filter(c => c.category === Category.c2sServer)
      .map(c => `**${c.name}**`);
    const embed = new EmbedBuilder()
      .setTitle('Semblance Command List')
      .setColor(randomColor)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(
        `All of the available commands below can be found through the ${applicationCommandToMention({
          client,
          commandName: 'help',
        })} command via the \`query\` option.`,
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
            `[here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=274878295040&scope=bot+applications.commands) to authorize Semblance.`,
          ].join(' '),
        },
      );
    const components = [
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
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
          .setEmoji('🚫')
          .setStyle(ButtonStyle.Secondary),
      ),
    ];

    return {
      embeds: [embed],
      components,
    };
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    const query = interaction.options.getString('query');
    if (!query) return interaction.reply(this.sharedRun(interaction));

    const commands = interaction.client.stores.get('commands').filter(c => 'sharedRun' in c);

    if (!commands.has(query)) {
      const possibleQueries = commands.map(i => i.name);
      const components = possibleQueries.reduce((acc, cur, i) => {
        const index = Math.floor(i / 25);
        if (!acc[index])
          acc[index] = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            new SelectMenuBuilder()
              .setCustomId(
                buildCustomId({
                  command: 'help',
                  action: `query-${index}`,
                  id: interaction.user.id,
                }),
              )
              .setPlaceholder('Select a query'),
          );
        (acc[index].components[0] as SelectMenuBuilder).addOptions({ label: cur, value: cur });
        return acc;
      }, [] as ActionRowBuilder<MessageActionRowComponentBuilder>[]);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('Help')
            .setDescription(
              "Due to an invalid query, here's a provided list from Semblance's help command in the dropdowns below.",
            ),
        ],
        components,
      });
    }

    // @ts-expect-error - more stupid unnecessary type errors
    const info = await commands.get(query)?.sharedRun(interaction);
    await interaction.reply(info as string);
  }

  public override autocompleteRun(interaction: AutocompleteInteraction<'cached'>) {
    const query = interaction.options.getFocused();

    const queriedInfoStartsWith = interaction.client.stores
      .get('commands')
      .filter(i => 'sharedRun' in i && i.name.startsWith(query))
      .map(i => ({ name: i.name, value: i.name }))
      .slice(0, 25);
    const queriedInfoContains = interaction.client.stores
      .get('commands')
      .filter(i => 'sharedRun' in i && !i.name.startsWith(query) && i.name.includes(query))
      .map(i => ({ name: i.name, value: i.name }))
      .slice(0, 25 - queriedInfoStartsWith.length);

    if (queriedInfoStartsWith.length == 0 && queriedInfoContains.length == 0) return;

    return interaction.respond([...queriedInfoStartsWith, ...queriedInfoContains]);
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
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
    });
  }
}
