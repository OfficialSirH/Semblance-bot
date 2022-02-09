import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor, guildBookPage } from '#constants/index';
import type { Semblance } from '#structures/Semblance';
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

const run = async (client: Semblance, message: Message, args: string[]) => {
  const { chosenPage, pageDetails } = guildBookPage(client, args[0]),
    numOfPages = Math.ceil(client.guilds.cache.size / serversPerPage);

  const components = [
      new MessageActionRow().addComponents([
        new MessageButton()
          .setLabel('First Page')
          .setStyle('SECONDARY')
          .setDisabled(chosenPage === 1)
          .setCustomId(
            JSON.stringify({
              command: 'serverlist',
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
            JSON.stringify({
              command: 'serverlist',
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
            JSON.stringify({
              command: 'serverlist',
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
            JSON.stringify({
              command: 'serverlist',
              action: 'last',
              id: message.author.id,
              page: chosenPage,
            }),
          ),
      ]),
    ],
    embed = new MessageEmbed()
      .setTitle(`Server List [${client.guilds.cache.size}] - Page ${chosenPage}`)
      .setColor(randomColor)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(pageDetails)
      .setFooter({ text: `Page ${chosenPage} out of ${numOfPages}` });
  message.channel.send({ embeds: [embed], components });
};
