import type { ParsedCustomIdData } from '#lib/interfaces/Semblance';
import { ActionRow, ButtonComponent, type ButtonInteraction, ButtonStyle, Embed } from 'discord.js';
import { guildBookPage, randomColor } from '#constants/index';
import { serversPerPage } from '#constants/commands';
import { componentInteractionDefaultParser, buildCustomId, defaultEmojiToUsableEmoji } from '#constants/components';
import { InteractionHandler, type PieceContext, InteractionHandlerTypes } from '@sapphire/framework';

export default class ServerList extends InteractionHandler {
  public constructor(context: PieceContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      name: 'serverlist',
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction) {
    return componentInteractionDefaultParser(this, interaction);
  }

  public override async run(
    interaction: ButtonInteraction<'cached'>,
    data: ParsedCustomIdData<'left' | 'right' | 'first' | 'last'> & { page: number },
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
        new ActionRow().addComponents(
          new ButtonComponent()
            .setLabel('First Page')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(chosenPage === 1)
            .setCustomId(
              buildCustomId({
                command: 'serverlist',
                action: 'first',
                id: user.id,
                page,
              }),
            ),
          new ButtonComponent()
            .setLabel('Left')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(defaultEmojiToUsableEmoji('⬅'))
            .setDisabled(chosenPage === 1)
            .setCustomId(
              buildCustomId({
                command: 'serverlist',
                action: 'left',
                id: user.id,
                page,
              }),
            ),
          new ButtonComponent()
            .setLabel('Right')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(defaultEmojiToUsableEmoji('➡'))
            .setDisabled(chosenPage === numOfPages)
            .setCustomId(
              buildCustomId({
                command: 'serverlist',
                action: 'right',
                id: user.id,
                page,
              }),
            ),
          new ButtonComponent()
            .setLabel('Last Page')
            .setStyle(ButtonStyle.Secondary)
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
      embed = new Embed()
        .setTitle(`Server List [${client.guilds.cache.size}] - Page ${chosenPage}`)
        .setColor(randomColor)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(pageDetails)
        .setFooter({ text: `Page ${chosenPage} out of ${numOfPages}` });
    await interaction.update({ embeds: [embed], components });
  }
}
