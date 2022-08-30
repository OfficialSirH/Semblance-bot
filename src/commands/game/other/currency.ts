import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, randomColor, Subcategories } from '#constants/index';
import {
  currentLogo,
  currency,
  entropy,
  idea,
  darwinium,
  metabit,
  fossil,
  mutagen,
  darkMatter,
  stardust,
  energy,
  sentience,
} from '#config';
import { Command } from '@sapphire/framework';

export default class Currency extends Command {
  public override name = 'currency';
  public override description = 'List all of the in-game currency.';
  public override fullCategory = [Categories.game, Subcategories.other];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new MessageEmbed()
      .setTitle('Currency')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setThumbnail(currentLogo.name)
      .addFields(
        {
          name: `${entropy} Entropy`,
          value: 'The beginning currency in the game, which is used to for evolution upgrades',
        },
        {
          name: `${idea} Idea`,
          value: 'A resource unlocked further in the game, which is used for technological advancements',
        },
        {
          name: `${metabit} Metabit`,
          value:
            'Prestige(main sim) currency that is unlocked after reaching singularity for the first time, this currency is used for upgrades in the Reality Engine and gives a boost in productivity the more you gain.',
        },
        {
          name: `${darwinium} Darwinium`,
          value: 'A resource used for boosts and geodes (diamond geode is very useful to build up for)',
        },
        {
          name: `${fossil} Fossils`,
          value: 'The main resource in the Mesozoic Valley to upgrade dinosaurs',
        },
        {
          name: `${mutagen} Mutagen`,
          value:
            'The resource in the Mesozoic Valley used for upgrading trait cards is gained through opening geodes and upgrading dinosaurs, which you can also purchase with darwinium.',
        },
        {
          name: `${stardust} Stardust`,
          value: 'The primary currency used in the Beyond bubble universe, which is used to buy generators in the tree',
        },
        {
          name: `${darkMatter} Dark Matter`,
          value: 'The resource is used in Beyond to upgrade traits of the planets',
        },
      )
      .setFooter({ text: 'List of currencies used ingame' });
    return { embeds: [embed], files: [currentLogo, currency] };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
