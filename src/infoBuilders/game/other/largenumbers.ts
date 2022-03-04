import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { currentLogo } from '#config';

export default class Largenumbers extends InfoBuilder {
  public override name = 'largenumbers';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build(builder: InfoBuilder['BuildOption']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new Embed()
      .setTitle('Large Numbers')
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
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
          "\nAll these names are case insensitive, meaning you don't have to type them in the exact correct capilization for it to work;" +
          " In case someone uses the British format for these names, please note that these are in US format, so they aren't the exact same as yours and if you would like to know what the names are in US format" +
          ', click [here](http://www.thealmightyguru.com/Pointless/BigNumbers.html)',
      )
      .setFooter({ text: 'Large Numbers go brrrr...' });
    return { embeds: [embed], files: [currentLogo] };
  }
}