﻿import { type Message, MessageEmbed } from 'discord.js';
import { Category, randomColor, Subcategory, attachments, emojis } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Currency extends Command {
  public override name = 'currency';
  public override description = 'List all of the in-game currency.';
  public override fullCategory = [Category.game, Subcategory.other];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new MessageEmbed()
      .setTitle('Currency')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .addFields(
        {
          name: `${emojis.entropy} Entropy`,
          value: 'The beginning currency in the game, which is used to for evolution upgrades',
        },
        {
          name: `${emojis.idea} Idea`,
          value: 'A resource unlocked further in the game, which is used for technological advancements',
        },
        {
          name: `${emojis.metabit} Metabit`,
          value:
            'Prestige(main sim) currency that is unlocked after reaching singularity for the first time, this currency is used for upgrades in the Reality Engine and gives a boost in productivity the more you gain.',
        },
        {
          name: `${emojis.darwinium} Darwinium`,
          value: 'A resource used for boosts and geodes (diamond geode is very useful to build up for)',
        },
        {
          name: `${emojis.fossil} Fossils`,
          value: 'The main resource in the Mesozoic Valley to upgrade dinosaurs',
        },
        {
          name: `${emojis.mutagen} Mutagen`,
          value:
            'The resource in the Mesozoic Valley used for upgrading trait cards is gained through opening geodes and upgrading dinosaurs, which you can also purchase with darwinium.',
        },
        {
          name: `${emojis.stardust} Stardust`,
          value: 'The primary currency used in the Beyond bubble universe, which is used to buy generators in the tree',
        },
        {
          name: `${emojis.darkMatter} Dark Matter`,
          value: 'The resource is used in Beyond to upgrade traits of the planets',
        },
      )
      .setFooter({ text: 'List of currencies used ingame' });
    return { embeds: [embed], files: [attachments.currentLogo, attachments.currency] };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
