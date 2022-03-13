import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor, guildBookPage, Categories } from '#constants/index';
import { Args, Command } from '@sapphire/framework';
import { serversPerPage } from '#constants/commands';
import { buildCustomId } from '#constants/components';

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
    const page = resolvablePage.success ? resolvablePage.value : 1;

    const { chosenPage, pageDetails } = guildBookPage(message.client, page);
    const numOfPages = Math.ceil(message.client.guilds.cache.size / serversPerPage);

    const components = [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel('First Page')
            .setStyle('SECONDARY')
            .setDisabled(chosenPage === 1)
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'first',
                id: message.author.id,
                page: chosenPage,
              }),
            ),
          new MessageButton()
            .setLabel('Left')
            .setStyle('SECONDARY')
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
          new MessageButton()
            .setLabel('Right')
            .setStyle('SECONDARY')
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
          new MessageButton()
            .setLabel('Last Page')
            .setStyle('SECONDARY')
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
      embed = new MessageEmbed()
        .setTitle(`Server List [${message.client.guilds.cache.size}] - Page ${chosenPage}`)
        .setColor(randomColor)
        .setThumbnail(message.client.user.displayAvatarURL())
        .setDescription(pageDetails)
        .setFooter({ text: `Page ${chosenPage} out of ${numOfPages}` });

    await message.reply({ embeds: [embed], components });
  }
}
