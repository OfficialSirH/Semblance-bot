import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import { currentLogo } from '#config';
import type { Command } from '#lib/interfaces/Semblance';

export default {
  description: 'Mesozoic Valley Guide',
  category: 'game',
  subcategory: 'mesozoic',
  aliases: ['mvguide', 'mesozoicguide', 'mesozoicvalleyguide'],
  permissionRequired: 0,
  checkArgs: () => true,
  run: (_client, message) => run(message),
} as Command<'game'>;

const run = async (message: Message) => {
  const embed = new MessageEmbed()
    .setTitle('**Mesozoic Valley Guide**')
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setDescription(
      'This guide is mainly aimed at helping people with their first run through the Mesozoic Valley.\n' +
        'For later runs, up to prestige 10 you should start saving up lots of mutagen to make getting the last achievements much easier. ' +
        'With the bonus income from the "Warm Climate" trait you can save yourself about 1-2 trait upgrades per dino - especially in the last runs, and still be really fast. ' +
        'Getting up to 5 million mutagen by Prestige 10 Rank 50 should be no problem. With this you can then buy and upgrade the traits for the gigantosaurus to very high levels. ' +
        'I recommend getting about 10 diamond geodes over all to get your rare and epic cards to a nice level. ',
    )
    .addFields([
      {
        name: '**Starting a new stage**',
        value: [
          '```\nWhen starting a new stage get to your newest dinos as fast as possible completely ignoring all the dinos before the newest 2-3. Then only upgrade these few as far as you can afford in the first 5-10 min.',
          'After that focus on completing missions to get geodes.```',
        ].join(' '),
        inline: true,
      },
      {
        name: '**Exiting a stage**',
        value: [
          '```\nI recommend only exiting a stage when you have completed all missions.',
          "Before doing so you should go through all your dinos and try to reach as many milestones as you can for some extra mutagen. Don't underestimate the effect of this, especially at higher stages.",
          'The milestones are 10, 25, 50, 100, 150, 250, and 500.```',
        ].join('\n'),
      },
      {
        name: '**Missions**',
        value: [
          '```\nThere are four mission types, two of them are a free source of mutagen and traits:',
          '- taking a photo of your newest dino',
          '- upgrading a certain amount of traits',
          'The other two can be a lot more challenging:',
          '- upgrading dinos to a particular level - you should just complete this one after the other',
          '- producing a certain amount of fossils - there are going to be 1-2 of these per stage, one of them most likely as the last mission with a very high amount of fossils```',
        ].join('\n'),
        inline: true,
      },
      {
        name: '**Traits**',
        value: [
          [
            '```\nThis segment is closely connected to the "shop"-part of the guide.',
            'Always upgrade the rare (silver) and epic (gold) traits when available because you keep them after you reset on stage 50.',
            'The normal traits should only be upgraded for your newest 2 dinos because newer dinos always have a better cost/income ratio. The level depends on which stage you are in.',
          ].join('\n'),
          [
            'Stage 1-5: lvl 1-2',
            'Stage 6-10: lvl 2-3',
            'Stage 11-15: lvl 3-4',
            'Stage 16-20: lvl 4-5',
            'Stage 21-25: lvl 5-6',
            'Stage 26-30: lvl 6-7',
            'Stage 31-35: lvl 7-8',
            'Stage 36-40: lvl 8-9',
            'Stage 41-45: lvl 9-10',
            'Stage 46-50: lvl 10-11',
          ].join('\n'),
          'If you have lots of mutagen left, you can of course use that to speed up you progress by upgrading the traits further.```',
        ].join('\n\n'),
      },
      {
        name: '** The Shop**',
        value: [
          '```\nThe Shop gives you options to buy geodes, traits, and mutagen. When and what to buy is really important because buying too much wastes resources and buying too little wastes time.',
          'Only buy diamond geodes, and those only on stage 50 before prestiging, because the contents of the geodes scale with your stage so it is most effective to buy them at 50.',
          'Buying traits is the only way of effectively leveling the new traits on higher stages.',
          'The shop always offers traits that don’t have an upgrade available. By always buying and instantly upgrading two traits you can get new traits to a high level really fast.',
          'There is no need to ever keep more than about 5 times the mutagen needed for the most expensive upgrade you want to get, so you can invest the rest in buying and upgrading traits.',
          'The mutagen part of the shop is not needed at any time. If you have an urge to spend darwinium then buy diamond geodes instead.```',
        ].join('\n\n'),
        inline: true,
      },
    ])
    .setFooter('Thanks to Jojoseis#0001 for making this guide! :D');
  message.channel.send({ embeds: [embed], files: [currentLogo] });
};
