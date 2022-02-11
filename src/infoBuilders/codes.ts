import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { Embed, ActionRow, ButtonComponent } from 'discord.js';
import { currentLogo } from '#config';

export const build: QueriedInfoBuilder = async (interaction, client) => {
  // const codeHandler = await Information.findOne({ infoType: 'codes' });
  const codeHandler = await client.db.information.findUnique({ where: { type: 'codes' } });
  const embed = new Embed()
    .setTitle('Darwinium Codes')
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setDescription(codeHandler.value)
    .setFooter(codeHandler.footer);
  const component = new ActionRow().addComponents([
    new ButtonComponent()
      .setCustomId(
        JSON.stringify({
          command: 'codes',
          action: 'expired',
          id: interaction.user.id,
        }),
      )
      .setLabel('View Expired Codes')
      .setStyle(ButtonStyle.Primary),
  ]);
  return {
    embeds: [embed],
    files: [currentLogo],
    components: [component],
  };
};
