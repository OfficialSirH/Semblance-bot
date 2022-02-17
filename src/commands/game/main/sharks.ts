import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import { currentLogo, sharks } from '#config';
import { Command } from '@sapphire/framework';

export default {
  description: 'Get info on sharks.',
  category: 'game',
  subcategory: 'main',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'game'>;

const run = async (message: Message) => {
  const embed = new Embed()
    .setTitle('Sharks')
    .setColor(randomColor)
    .setImage(sharks.name)
    .setThumbnail(currentLogo.name)
    .setDescription(
      'There are six sharks within the game that can be unlocked within the daily rewards individually every 14 days, which takes 84 days to unlock all of them, which will give you the achievement, "Shark Week".\n They\'re unlocked in this order: \n' +
        '1. Leopard Shark \n 2. Whale Shark \n 3. Tiger Shark \n 4. Great White \n 5. Hammerhead \n 6. **MEGALODON!!**',
    );
  message.channel.send({ embeds: [embed], files: [currentLogo, sharks] });
};
