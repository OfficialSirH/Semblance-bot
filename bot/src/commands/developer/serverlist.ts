import { randomColor, guildBookPage, Category, GuildId, PreconditionName } from '#constants/index';
import { Command } from '#structures/Command';
import { serversPerPage } from '#constants/commands';
import { buildCustomId } from '#constants/components';
import { ButtonStyle, ApplicationCommandOptionType } from '@discordjs/core';

export default class ServerList extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'serverlist',
      description: 'Lists all servers that Semblance is in.',
      fullCategory: [Category.developer],
      preconditions: [PreconditionName.OwnerOnly],
    });
  }

  public override async chatInputRun(interaction: APIApplicationCommandInteraction) {
    const page = interaction.options.getInteger('page') || 1;
    const { client, user } = interaction;

    const { chosenPage, pageDetails } = guildBookPage(client, page);
    const numOfPages = Math.ceil(client.guilds.cache.size / serversPerPage);

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
                id: user.id,
                page: chosenPage,
              }),
            ),
          new ButtonBuilder()
            .setLabel('Left')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⬅')
            .setDisabled(chosenPage === 1)
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'left',
                id: user.id,
                page: chosenPage,
              }),
            ),
          new ButtonBuilder()
            .setLabel('Right')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('➡')
            .setDisabled(chosenPage === numOfPages)
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'right',
                id: user.id,
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
                id: user.id,
                page: chosenPage,
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

    await interaction.reply({ embeds: [embed], components });
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
      },
      guildIds: [GuildId.sirhStuff],
    };
  }
}
