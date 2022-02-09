import type { CustomIdData, ComponentHandler } from '#lib/interfaces/Semblance';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { guildBookPage, randomColor } from '#constants/index';
import { serversPerPage } from '#constants/commands';

export default {
  buttonHandle: async (interaction, { action, page }: ServerlistButtonData) => {
    const { client, user } = interaction,
      numOfPages = Math.ceil(client.guilds.cache.size / serversPerPage);

    if (action == 'left') page--;
    else if (action == 'right') page++;
    else if (action == 'first') page = 1;
    else page = numOfPages;

    const { chosenPage, pageDetails } = guildBookPage(client, page);

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
                id: user.id,
                page,
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
                id: user.id,
                page,
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
                id: user.id,
                page,
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
                id: user.id,
                page,
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
    interaction.update({ embeds: [embed], components });
  },
} as ComponentHandler;

interface ServerlistButtonData extends CustomIdData {
  page: number;
}
