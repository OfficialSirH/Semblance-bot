import { currentLogo, darwinium } from '#config';
import { Categories, Subcategories, randomColor } from '#constants/index';
import { Command } from '@sapphire/framework';
import { MessageEmbed, type Message } from 'discord.js';

export default class Limericks extends Command {
  public override name = 'limericks';
  public override description = 'details on the limericks contest';
  public override fullCategory = [Categories.game, Subcategories.other];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new MessageEmbed()
      .setTitle('Limericks Contest winners')
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setDescription(
        [
          `**1st Place(2000 ${darwinium}):** Jean_Xontric -`,
          'Before the dinosaur ran out of luck,',
          'he lectured a four-legged, furry duck: ',
          '"We could rule as best mates,',
          'hatched from amniote traits, ',
          'yet like all other mammals - you suck!"\n',
          `**2nd Place(1000 ${darwinium}):** SampeDrako -`,
          'Tengo un murci\u00E9lago',
          'Dale ajo y acaba ciego',
          'Un trago de sangre',
          'y se pone alegre',
          'Nuestro amigo noct\u00EDvago\n',
          `**3rd Place(500 ${darwinium}):** Daenerys -`,
          'Quite tall stands the mighty elephant',
          "What's more, it's also intelligent",
          'Enjoys a banana',
          'In the dry savannah',
          "This beast's huge trunk sure is elegant\n",
          `**Honorable Mention(200 ${darwinium}):** Theorian -`,
          'From stars we come and to stars we go',
          'The entropy of life can never slow',
          'With great peculiarity',
          'From cell to singularity',
          'Playing our parts in the greatest show',
        ].join('\n'),
      )
      .setFooter({ text: 'Let the hunger gam-- I mean Limericks Contest- begin!' });
    return { embeds: [embed], files: [currentLogo] };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
