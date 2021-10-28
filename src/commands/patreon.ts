import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import config from '#config';
import type { Command } from '#lib/interfaces/Semblance';
const { patreon } = config;

export default {
  description: 'Provides the link to SirH\'s Patreon page.',
  category: 'semblance',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'semblance'>;

const run = async (message: Message) => {
  const embed = new MessageEmbed()
    .setTitle('My Patreon')
    .setURL('https://www.patreon.com/SirHDeveloper')
    .setColor(randomColor)
    .setThumbnail(patreon.name)
    .setDescription(
      [
        'The rewards for becoming a patreon are:',
        '- You get access to Semblance Beta',
        '- You get a hoisted role in my Discord server (SirH\'s Stuff)',
        '- (Soon:tm:) Get a 2x boosted income in Semblance\'s Idle-Game',
        '- Make me very happy',
      ].join('\n'),
    );
  message.channel.send({ embeds: [embed], files: [patreon] });
};
