import type { CustomIdData, ParsedCustomIdData } from '#lib/interfaces/Semblance';
import { MessageActionRow, type ButtonInteraction, MessageEmbed, MessageButton } from 'discord.js';
import { guildBookPage, randomColor } from '#constants/index';
import { serversPerPage } from '#constants/commands';
import { componentInteractionDefaultParser, buildCustomId } from '#constants/components';
import { InteractionHandler, type PieceContext, InteractionHandlerTypes } from '@sapphire/framework';

interface ServerListCustomIdData extends CustomIdData {
  page: number;
}

export default class ServerList extends InteractionHandler {
  public constructor(context: PieceContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      name: 'serverlist',
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction) {
    return componentInteractionDefaultParser<ServerListCustomIdData>(this, interaction, {
      extraProps: {
        page: 'number',
      },
    });
  }

  public override async run(
    interaction: ButtonInteraction<'cached'>,
    data: ParsedCustomIdData<'left' | 'right' | 'first' | 'last', ServerListCustomIdData>,
  ) {
    const { client, user } = interaction;
    let page = data.page;
    const numOfPages = Math.ceil(client.guilds.cache.size / serversPerPage);

    if (data.action == 'left') page--;
    else if (data.action == 'right') page++;
    else if (data.action == 'first') page = 1;
    else page = numOfPages;

    const { chosenPage, pageDetails } = guildBookPage(client, page);

    const components = [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel('First Page')
            .setStyle('SECONDARY')
            .setDisabled(chosenPage === 1)
            .setCustomId(
              buildCustomId({
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
              buildCustomId({
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
              buildCustomId({
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
              buildCustomId({
                command: 'serverlist',
                action: 'last',
                id: user.id,
                page,
              }),
            ),
        ),
      ],
      embed = new MessageEmbed()
        .setTitle(`Server List [${client.guilds.cache.size}] - Page ${chosenPage}`)
        .setColor(randomColor)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(pageDetails)
        .setFooter({ text: `Page ${chosenPage} out of ${numOfPages}` });
    await interaction.update({ embeds: [embed], components });
  }
}
