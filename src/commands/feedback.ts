import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import type { Command } from '#lib/interfaces/Semblance';

export default {
  description: 'Provide feedback to the developers of C2S with the given email.',
  category: 'game',
  subcategory: 'other',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'game'>;

const run = async (message: Message) => {
  let feedbackImage = 'https://i.imgur.com/lKQh5zW.png';
  let embed = new MessageEmbed()
    .setTitle('Feedback')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(randomColor)
    .setDescription("Give feedback for ComputerLunch's game, C2S.")
    .setImage(feedbackImage);
  message.channel.send({ embeds: [embed] });
};
