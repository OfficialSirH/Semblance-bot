import { type Message, MessageEmbed } from 'discord.js';
import { attachments, Category, randomColor, Subcategory } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class LargeNumbers extends Command {
  public override name = 'largenumbers';
  public override description = 'List of all the named large numbers in the game.';
  public override fullCategory = [Category.game, Subcategory.other];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new MessageEmbed()
      .setTitle('Large Numbers')
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
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
    return { embeds: [embed], files: [attachments.currentLogo] };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
