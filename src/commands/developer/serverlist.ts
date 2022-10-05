import {
  type Message,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  type MessageActionRowComponentBuilder,
  ButtonStyle,
} from 'discord.js';
import { randomColor, guildBookPage, Category } from '#constants/index';
import { type Args, Command } from '@sapphire/framework';
import { serversPerPage } from '#constants/commands';
import { buildCustomId } from '#constants/components';

export default class ServerList extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'serverlist',
      description: 'Lists all servers that Semblance is in.',
      fullCategory: [Category.developer],
      preconditions: ['OwnerOnly'],
    });
  }

  public override async messageRun(message: Message, args: Args) {
    const resolvablePage = await args.pickResult('number');
    const page = resolvablePage.isOk ? resolvablePage.unwrap() : 1;

    const { chosenPage, pageDetails } = guildBookPage(message.client, page);
    const numOfPages = Math.ceil(message.client.guilds.cache.size / serversPerPage);

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
                id: message.author.id,
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
                id: message.author.id,
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
                id: message.author.id,
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
                id: message.author.id,
                page: chosenPage,
              }),
            ),
        ),
      ],
      embed = new EmbedBuilder()
        .setTitle(`Server List [${message.client.guilds.cache.size}] - Page ${chosenPage}`)
        .setColor(randomColor)
        .setThumbnail(message.client.user.displayAvatarURL())
        .setDescription(pageDetails)
        .setFooter({ text: `Page ${chosenPage} out of ${numOfPages}` });

    await message.reply({ embeds: [embed], components });
  }
}
