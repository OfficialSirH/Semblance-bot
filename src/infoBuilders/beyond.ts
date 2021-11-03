import { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { MessageEmbed } from 'discord.js';

export const build: QueriedInfoBuilder = interaction => {
  const { user } = interaction;
  const embed = new MessageEmbed()
    .setTitle('Beyond Counter')
    .setAuthor(user.tag, user.displayAvatarURL())
    .setColor(randomColor)
    .setDescription(
      `The Beyond has been mentioned 5203 time(s) since ${new Date(1611959542848)} all the way till ${new Date(
        1635971517445,
      )}`,
    )
    .setFooter('Since')
    .setTimestamp(1611959542848);
  return { embeds: [embed] };
};
