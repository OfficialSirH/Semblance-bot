import { attachments, Category, randomColor, SubCategory } from '#constants/index';
import { Command } from '#structures/Command';
import { EmbedBuilder } from '@discordjs/builders';

export default class LargeNumbers extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'largenumbers',
      description: 'List of all the named large numbers in the game.',
      fullCategory: [Category.game, SubCategory.other],
    });
  }

  public override templateRun() {
    const embed = new EmbedBuilder()
      .setTitle('Large Numbers')
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.url)
      .setDescription(
        [
          'M(Million), B(Billion)',
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
          '\n In case someone uses the British format for these names, please note that these are in US format' +
          ', for more details, click [here](http://www.thealmightyguru.com/Pointless/BigNumbers.html)',
      )
      .setFooter({ text: 'Large Numbers go brrrr...' });
    return { embeds: [embed.toJSON()], files: [attachments.currentLogo] };
  }
}
