import { gameTransferPages } from '#constants/commands';
import { attachments } from '#constants/index';
import { componentInteractionDefaultParser } from '#constants/components';

import type { ParsedCustomIdData } from '#lib/interfaces/Semblance';

export default class GameTransfer extends InteractionHandler {
  public constructor(context: PieceContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      name: 'gametransfer',
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction): ReturnType<typeof componentInteractionDefaultParser> {
    return componentInteractionDefaultParser(this, interaction);
  }

  public override async run(interaction: ButtonInteraction, data: ParsedCustomIdData<'right' | 'left'>) {
    const embed = new EmbedBuilder(interaction.message.embeds.at(0)?.data);
    let currentPage = gameTransferPages.indexOf(embed.data.image ? embed.data.image.url : '');

    if (data.action == 'right') currentPage = currentPage == 4 ? 0 : ++currentPage;
    else if (data.action == 'left') currentPage = currentPage == 0 ? 4 : --currentPage;

    let description: string | null = null;
    if (currentPage == 0) description = '\nClick on the Game transfer button in the menu';
    else if (currentPage == 1) description = '\nCreate an account and login into it';
    else if (currentPage == 2) description = '\nClick on the Transfer Save Data button after logging into your account';
    else if (currentPage == 3) description = '\nUpload your progress from your current device';
    else if (currentPage == 4)
      description = '\nDownload your progress onto the other device you wish to put your progress on';

    embed
      .setThumbnail(attachments.currentLogo.url)
      .setImage(gameTransferPages[currentPage])
      .setDescription(`Step ${currentPage + 1}:${description}`);
    await interaction.update({ embeds: [embed.toJSON()] });
  }
}
