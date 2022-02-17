import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { currentLogo, darwinium } from '#config';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';

export default class Limericks extends InfoBuilder {
  public override name = 'limericks';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build(builder: InfoBuilder['BuildOption']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new Embed()
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
}
