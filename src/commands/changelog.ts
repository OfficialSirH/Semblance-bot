﻿import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import { Command } from '@sapphire/framework';
import type { SapphireClient } from '@sapphire/framework';

export default {
  description: 'Provides the latest changes to Semblance.',
  category: 'semblance',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message) => run(client, message),
} as Command<'semblance'>;

const run = async (client: SapphireClient, message: Message) => {
  const changelogHandler = await client.db.information.findUnique({ where: { type: 'changelog' } });
  const embed = new Embed()
    .setTitle('Changelog')
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
    .setColor(randomColor)
    .setDescription(changelogHandler.value);
  message.channel.send({ embeds: [embed] });
};
