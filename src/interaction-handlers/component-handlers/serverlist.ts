import type { CustomIdData } from '#lib/interfaces/Semblance';
import { ActionRow, ButtonComponent, Embed } from 'discord.js';
import { guildBookPage, randomColor } from '#constants/index';
import { serversPerPage } from '#constants/commands';

export default class HANDLER_NAME extends InteractionHandler {
  public constructor(context: PieceContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      name: 'HANDLER_NAME',
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction) {
    return componentInteractionDefaultParser(this, interaction);
  }

  // public override async run(interaction: ButtonInteraction, data: Omit<CustomIdData, 'command'>) {

  // }
}

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
        new ActionRow().addComponents([
          new ButtonComponent()
            .setLabel('First Page')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(chosenPage === 1)
            .setCustomId(
              JSON.stringify({
                command: 'serverlist',
                action: 'first',
                id: user.id,
                page,
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
                id: user.id,
                page,
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
                id: user.id,
                page,
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
                id: user.id,
                page,
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
    interaction.update({ embeds: [embed], components });
  },
} as ComponentHandler;

interface ServerlistButtonData extends CustomIdData {
  page: number;
}
