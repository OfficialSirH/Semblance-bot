import { ActionRow, ButtonComponent, Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor, guildBookPage } from '#constants/index';
import type { SapphireClient } from '@sapphire/framework';
import type { Command } from '#lib/interfaces/Semblance';
import { serversPerPage } from '#constants/commands';

export default {
  description: 'Lists all servers that Semblance is in.',
  category: 'developer',
  usage: {
    'page number': '',
  },
  permissionRequired: 7,
  checkArgs: () => true,
  run: (client, message, args) => run(client, message, args),
} as Command<'developer'>;

const run = async (client: SapphireClient, message: Message, args: string[]) => {
  const { chosenPage, pageDetails } = guildBookPage(client, args[0]),
    numOfPages = Math.ceil(client.guilds.cache.size / serversPerPage);

  const components = [
      new ActionRow().addComponents([
        new ButtonComponent()
          .setLabel('First Page')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(chosenPage === 1)
          .setCustomId(
            JSON.stringify({
              command: 'serverlist',
              action: 'first',
              id: message.author.id,
              page: chosenPage,
            }),
          ),
        new ButtonComponent()
          .setLabel('Left')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('⬅')
          .setDisabled(chosenPage === 1)
          .setCustomId(
            JSON.stringify({
              command: 'serverlist',
              action: 'left',
              id: message.author.id,
              page: chosenPage,
            }),
          ),
        new ButtonComponent()
          .setLabel('Right')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('➡')
          .setDisabled(chosenPage === numOfPages)
          .setCustomId(
            JSON.stringify({
              command: 'serverlist',
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
            JSON.stringify({
              command: 'serverlist',
              action: 'last',
              id: message.author.id,
              page: chosenPage,
            }),
          ),
      ]),
    ],
    embed = new Embed()
      .setTitle(`Server List [${client.guilds.cache.size}] - Page ${chosenPage}`)
      .setColor(randomColor)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(pageDetails)
      .setFooter({ text: `Page ${chosenPage} out of ${numOfPages}` });
  message.channel.send({ embeds: [embed], components });
};
