import { ActionRow, ButtonComponent, ButtonStyle, Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor, guildBookPage, Categories } from '#constants/index';
import { Args, Command } from '@sapphire/framework';
import { serversPerPage } from '#constants/commands';
import { buildCustomId, defaultEmojiToUsableEmoji } from '#src/constants/components';

export default class ServerList extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'serverlist',
      description: 'Lists all servers that Semblance is in.',
      fullCategory: [Categories.developer],
      preconditions: ['OwnerOnly'],
    });
  }

  public override async messageRun(message: Message, args: Args) {
    const resolvablePage = await args.pickResult('number');
    if (!resolvablePage.success) return message.reply('Invalid page number.');

    const { chosenPage, pageDetails } = guildBookPage(message.client, resolvablePage.value);
    const numOfPages = Math.ceil(message.client.guilds.cache.size / serversPerPage);

    const components = [
        new ActionRow().addComponents(
          new ButtonComponent()
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
          new ButtonComponent()
            .setLabel('Left')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(defaultEmojiToUsableEmoji('⬅'))
            .setDisabled(chosenPage === 1)
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'left',
                id: message.author.id,
                page: chosenPage,
              }),
            ),
          new ButtonComponent()
            .setLabel('Right')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(defaultEmojiToUsableEmoji('➡'))
            .setDisabled(chosenPage === numOfPages)
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'right',
                id: message.author.id,
                page: chosenPage,
              }),
            ),
          new ButtonComponent()
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
      embed = new Embed()
        .setTitle(`Server List [${message.client.guilds.cache.size}] - Page ${chosenPage}`)
        .setColor(randomColor)
        .setThumbnail(message.client.user.displayAvatarURL())
        .setDescription(pageDetails)
        .setFooter({ text: `Page ${chosenPage} out of ${numOfPages}` });

    await message.reply({ embeds: [embed], components });
  }
}
