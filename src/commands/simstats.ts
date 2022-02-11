import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import { currentLogo, simStatsLocation } from '#config';
import type { Command } from '#lib/interfaces/Semblance';

export default {
  description: 'guide for finding the simulation stats page in-game',
  category: 'game',
  subcategory: 'main',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'game'>;

const run = async (message: Message) => {
  const embed = new Embed()
    .setTitle('Simulation Statistics')
    .setThumbnail(currentLogo.name)
    .setColor(randomColor)
    .setImage(simStatsLocation.name)
    .setDescription(
      'Clicking your currency(Image 1) will open the Semblance/Reality Engine, which looking towards the left side of the engine will have a sliding button(Image 2) that will show your game stats.',
    );
  message.channel.send({
    embeds: [embed],
    files: [currentLogo, simStatsLocation],
  });
};
