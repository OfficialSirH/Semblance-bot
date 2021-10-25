import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import config from '#config';
import type { Command } from '#lib/interfaces/Semblance';
const { archieDance } = config;

export default {
  description: 'View epic videos of Archie dancing.',
  category: 'fun',
  usage: {
    '': '',
  },
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'fun'>;

const run = async (message: Message) => {
  let embed = new MessageEmbed()
    .setTitle('Dancing Archie/Jotaru')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(
      'Click the link above for the epic 3 minute video with Archie and Jotaru dancing, which I made as suggested by McScrungledorf#6020. ' +
        "Also, above is a short video of Archie's dance animation from the game :P",
    )
    .setURL('https://drive.google.com/file/d/1twLIqvEG-wwZJFmhtSERWBM5KoJ3zmkg/view?usp=sharing');
  message.channel.send({ embeds: [embed], files: [archieDance] });
};
