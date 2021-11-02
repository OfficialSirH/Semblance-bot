import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { Information } from '#models/Information';
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import config from '#config';
const { currentLogo } = config;

export const build: QueriedInfoBuilder = async interaction => {
  const codeHandler = await Information.findOne({ infoType: 'codes' });
  const embed = new MessageEmbed()
    .setTitle('Darwinium Codes')
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setDescription(codeHandler.info)
    .setFooter(codeHandler.footer);
  const component = new MessageActionRow().addComponents([
    new MessageButton()
      .setCustomId(
        JSON.stringify({
          command: 'codes',
          action: 'expired',
          id: interaction.user.id,
        }),
      )
      .setLabel('View Expired Codes')
      .setStyle('PRIMARY'),
  ]);
  return {
    embeds: [embed],
    files: [currentLogo],
    components: [component],
  };
};
