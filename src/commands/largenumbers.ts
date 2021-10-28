import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import config from '#config';
import { randomColor } from '#constants/index';
import type { Command } from '#lib/interfaces/Semblance';
const { currentLogo } = config;

export default {
  description: 'Provides details of shorter ways to using large numbers as input.',
  category: 'help',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'help'>;

const run = async (message: Message) => {
  const embed = new MessageEmbed()
    .setTitle('Large Numbers')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(
      [
        'the way to use all of the names when using the calculator commands are:\n' + 'M(Million), B(Billion)',
        'T(Trillion), Qa(Quadrillion)',
        'Qi(Quintrillion), Sx(Sextillion)',
        'Sp(Septillion), Oc(Octillion)',
        'No(Nonillion), Dc(Decillion)',
        'UDc(UnDecillion), DDc(DuoDecillion)',
        'tDc(TreDecillion), QaDc(QuattuorDecillion)',
        'QiDc(QuinDecillion), SxDc(SexDecillion)',
        'SpDc(SeptenDecillion), OcDc(OctoDecillion)',
        'NoDc(NovemDecillion), V(Vigintillion)',
      ].join(',\n') +
        '\nAll these names are case insensitive, meaning you don\'t have to type them in the exact correct capilization for it to work;' +
        ' In case someone uses the British format for these names, please note that these are in US format, so they aren\'t the exact same as yours and if you would like to know what the names are in US format' +
        ', click [here](http://www.thealmightyguru.com/Pointless/BigNumbers.html)',
    )
    .setFooter('Large Numbers go brrrr...');
  message.channel.send({ embeds: [embed], files: [currentLogo] });
};
