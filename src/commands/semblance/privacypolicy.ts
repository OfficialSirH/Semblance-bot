import { MessageEmbed, type Message } from 'discord.js';
import { Categories, randomColor } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class PrivacyPolicy extends Command {
  public override name = 'privacypolicy';
  public override description = 'Get the privacy policy for Semblance.';
  public override fullCategory = [Categories.semblance];

  public override async messageRun(message: Message) {
    const embed = new MessageEmbed()
      .setTitle('Privacy Policy')
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
      .setColor(randomColor)
      .setURL('https://github.com/OfficialSirH/Semblance-bot/blob/master/Privacy%20Policy.md');

    await message.reply({ embeds: [embed] });
  }
}
