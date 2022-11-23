import { EmbedBuilder } from 'discord.js';
import { attachments, emojis, Category, randomColor, Subcategory } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Singularity extends Command {
  public override name = 'singularity';
  public override description = 'detailed guide about singularity and speedrunning';
  public override fullCategory = [Category.game, Subcategory.main];

  public override sharedRun() {
    const embed = new EmbedBuilder()
      .setTitle(`${emojis.singularity}Singularity`)
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .setDescription(
        [
          "**What is the Singularity?**\nSo you've reached the singularity upgrade and the simulation crashed for some reason? well let me just tell you that the simulation didn't actually crash; I just wanted to prank you and restart all your work ***mwuahahahaha***... but seriously, it's a new journey from here out now. You can gain metabits (prestige currency), which will boost your earnings the more you collect.",
          [
            '**Quick Singularity Speedrun Guide:**\n',

            '**Basic Information:**',
            'I recommend at least 1e12(AKA, 1 trillion) metabits.',
            "Read and practice first, it's probably not going to work on first try. Buy you are going to get faster every run.\n",

            '**1.** Start',
            '**2.** Click really fast for 1 sec to unlock the evolution tree and get your first Amino Acid',
            '**3.** Immediately switch to the shop on the left side instead of buying stuff in the tree',
            '**4.** Now loop the following actions until you reach humans:',
            '\t- go to the "Research"-tab and buy everything available',
            '\t- go to the "Life"-tab and buy everything you haven\'t bought before once with the "max" setting',
            '**5.** Click the brain for 1 sec really fast to get the first stone age',
            '**6.** Now loop the following actions until you reach the singularity:',
            '\t- go to the "Research"-tab and buy everything available',
            '\t- go to the "Civilization"-tab and buy the newest civilization once with the "max" setting',
            '**7.** 🎉 Party 🎉\n',

            "**If you're still having difficulties, here are some stuff to improve on, but be aware that these may be a bit tricky to execute:**",
            '\t- Only buy the animals from the main tree',
            '\t- ignore the mammal and reptile evolution tree extensions',
            '\t- Fast switch from Entropy to Ideas',
          ].join('\n'),
        ].join('\n\n'),
      )
      .setFooter({ text: 'Thanks to Jojoseis#0001 for making the Singularity Speedrun Guide' });
    return { embeds: [embed], files: [attachments.currentLogo.attachment] };
  }
}
