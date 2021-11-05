import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import config from '#config';
import { prefix, randomColor } from '#constants/index';
import type { Command } from '#lib/interfaces/Semblance';
import { Semblance } from '#structures/Semblance';
const { currentLogo, prestige, prestigeList } = config;

export default {
  description: 'Get info on the Mesozoic Valley prestige.',
  category: 'game',
  subcategory: 'mesozoic',
  aliases: ['prestigelist'],
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message, args, identifier) => run(client, message, args, identifier),
} as Command<'game'>;

const run = async (client: Semblance, message: Message, args: string[], identifier: string) => {
  if ((args[0] && args[0].toLowerCase() == 'list') || identifier == 'prestigelist') return sendPrestigeList(message);
  const embed = new MessageEmbed()
    .setTitle('Mesozoic Valley Prestige')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(randomColor)
    .setImage(prestige.name)
    .setThumbnail(currentLogo.name)
    .setDescription(
      'Prestige in the Mesozoic Valley is unlocked at rank 50, which is also the rank that is recommended to purchase the diamond geode. ' +
        `Prestige also allows you to keep your Mutagen. Type \`${prefix} prestigelist\` or \`${prefix} prestige list\` for a list of all Prestige!`,
    )
    .setFooter("Footer goes brrr... I don't understand this meme.");
  message.channel.send({ embeds: [embed], files: [currentLogo, prestige] });
};

function sendPrestigeList(message: Message) {
  const embed = new MessageEmbed()
    .setTitle('Mesozoic Valley Prestige List')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setImage(prestigeList.name)
    .setFooter('Thanks to Hardik for this lovely list of Prestige :D');
  message.channel.send({ embeds: [embed], files: [currentLogo, prestigeList] });
}
