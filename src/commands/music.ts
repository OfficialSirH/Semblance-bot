import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import config from '#config';
import type { Command } from '#lib/interfaces/Semblance';
const { currentLogo } = config;

export default {
  description: 'Provides the links to the ingame music on the Fandom wiki and on Spotify.',
  category: 'game',
  subcategory: 'other',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'game'>;

const run = async (message: Message) => {
  const embed = new MessageEmbed()
    .setTitle('Music')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setDescription(
      [
        `Here's a link to the music, ${message.author.tag}`,
        '[Fandom Wiki](https://cell-to-singularity-evolution.fandom.com/wiki/music)',
        '[Spotify Link](https://open.spotify.com/playlist/6XcJkgtRFpKwoxKleKIOOp?si=uR4gzciYQtKiXGPwY47v6w)',
      ].join('\n'),
    );
  message.channel.send({ embeds: [embed], files: [currentLogo] });
};
