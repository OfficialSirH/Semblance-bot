import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import { currentLogo } from '#config';
import type { Command } from '#lib/interfaces/Semblance';
import type { SapphireClient } from '@sapphire/framework';

export default {
  description: 'Get info on the latest update of C2S.',
  category: 'game',
  subcategory: 'other',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message) => run(client, message),
} as Command<'game'>;

const run = async (client: SapphireClient, message: Message) => {
  const infoHandler = await client.db.information.findUnique({ where: { type: 'update ' } });
  const embed = new Embed()
    .setTitle('Steam and Mobile Updates')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setDescription(infoHandler.value);
  message.channel.send({ embeds: [embed], files: [currentLogo] });
};
