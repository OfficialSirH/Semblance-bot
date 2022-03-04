import {
  ActionRow,
  ButtonComponent,
  Embed,
  ButtonStyle,
  type ChatInputCommandInteraction,
  SelectMenuComponent,
  ApplicationCommandOptionType,
  type AutocompleteInteraction,
  SelectMenuOption,
} from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, prefix, randomColor } from '#constants/index';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';

export default class Help extends Command {
  public override name = 'help';
  public override description = 'Lists all available commands.';
  public override fullCategory = [Categories.help];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const c2sServerCommands = builder.client.stores
      .get('commands')
      .filter(c => c.category === Categories.c2sServer)
      .map(c => `**${prefix}${c.name}**`);
    const embed = new Embed()
      .setTitle('Semblance Command List')
      .setColor(randomColor)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setThumbnail(builder.client.user.displayAvatarURL())
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
            `[here](https://discord.com/oauth2/authorize?client_id=${builder.client.user.id}&permissions=8&scope=bot+applications.commands) to authorize Semblance.`,
          ].join(' '),
        },
      )
      .setFooter({
        text: `Stay Cellular! If you really like the work I've done to Semblance, then check out ${prefix}patreon :D`,
      });
    const components = [
      new ActionRow().addComponents(
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'help',
              action: 'c2shelp',
              id: user.id,
            }),
          )
          .setLabel('Cell to Singularity Help')
          .setStyle(ButtonStyle.Primary),
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'help',
              action: 'calchelp',
              id: user.id,
            }),
          )
          .setLabel('Calculator Help')
          .setStyle(ButtonStyle.Primary),
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'help',
              action: 'mischelp',
              id: user.id,
            }),
          )
          .setLabel('Miscellaneous Help')
          .setStyle(ButtonStyle.Primary),
        new ButtonComponent()
          .setCustomId(
            JSON.stringify({
              command: 'help',
              action: 'close',
              id: user.id,
            }),
          )
          .setLabel('Close')
          .setEmoji({ name: '🚫' })
          .setStyle(ButtonStyle.Secondary),
      ),
    ];
    return {
      content: 'side note: if your Discord client supports it, you can use: `/help` instead.',
      embeds: [embed],
      components,
    };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
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
          acc[index] = new ActionRow().addComponents(
            new SelectMenuComponent()
              .setCustomId(
                JSON.stringify({
                  command: 'help',
                  action: `query-${index}`,
                  id: interaction.user.id,
                }),
              )
              .setPlaceholder('Select a query'),
          );
        (acc[index].components[0] as SelectMenuComponent).addOptions(
          new SelectMenuOption().setLabel(cur).setValue(cur),
        );
        return acc;
      }, [] as ActionRow[]);
      return interaction.reply({
        embeds: [
          new Embed()
            .setTitle('Help')
            .setDescription(
              "Due to an invalid query, here's a provided list from Semblance's help command in the dropdowns below.",
            ),
        ],
        components,
      });
    }
    const info = await commands.get(query).sharedRun(interaction);
    await interaction.reply(info);
  }

  public override autocompleteRun(interaction: AutocompleteInteraction<'cached'>) {
    const query = interaction.options.getFocused() as string;

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