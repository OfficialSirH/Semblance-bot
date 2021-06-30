import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Semblance } from '../structures';
const { currentLogo } = config;

module.exports = {
    description: "Mesozoic Valley Guide",
    category: 'game',
    subcategory: 'mesozoic',
    usage: {
        "": ""
    },
    aliases: ['mvguide', 'mesozoicguide', 'mesozoicvalleyguide'],
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    const embed = new MessageEmbed()
        .setTitle(`**Mesozoic Valley Guide**`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setThumbnail(currentLogo.name)
        .addFields([
            {
                name: '**Starting a new stage**',
                value: [`\`\`\`\nWhen starting a new stage get to your newest dinos as fast as possible completely ignoring all the dinos before the newest 3-4. Then only upgrade these few as far as you can afford in the first 10-15 min.`, 
                    `After that focus on the missions to get geodes to upgrade your trait cards.`,
                    `Buying other dinos is only recommended right before getting to the next stage to take the free mutagen from getting 25, 50, 100, 150, 250 and 500 of one dino. Don’t buy anything that doesn’t achieve one of these two things.\`\`\``].join(' '),
                    inline: true
            },
            {
                name: '**Missions**',
                value: [`\`\`\`\nAlways try to do all the missions before calling the asteroid to get to the next stage.`,
                `Leaving one open might not be a big deal but getting all of them is recommended because the missing trait cards and mutagen will really hurt you in the long run.\`\`\``].join(' ')
            },
            { 
                name: '**Traits**',
                value: [`\`\`\`\nAlways upgrade the rare (silver) and epic (gold) traits because you keep them after you reset on stage 50. The normal traits should be upgraded depending on which level you are on. Only upgrade the newest 2-3 dinos to this level, because the efficiency drops significantly below that.`,
                    [`(This next segment is not completely accurate yet, so only take it as a rough estimate)`,
                    `Recommended trait level depending on stage:`].join('\n'),
                    [`Stage 1-5: lvl 1-2`,
                    `Stage 6-10: lvl 2-3`,
                   `Stage 11-15: lvl 3-4`,
                    `Stage 16-20: lvl 4-5`,
                    `Stage 21-25: lvl 5-6`,
                    `Stage 26-30: lvl 6-7`,
                    `Stage 31-35: lvl 7-8`,
                    `Stage 36-40: lvl 8-9`,
                    `Stage 41-45: lvl 9-10`,
                    `Stage 46-50: lvl 10-11`].join('\n'),
                    `If you have lots of mutagen left, you can of course use that to speed up you progress by upgrading the traits further.\`\`\``
                ].join('\n\n'),
                inline: true
            },
            {
                name: '** The Shop**',
                value: [`\`\`\`\nThe shop is the third tab in the navigation menu. The Shop gives you options to buy geodes, trait cards and mutagen. When to buy what stuff is really important because buying too much wastes resources and buying too little wastes time.`,

                `Buy Geodes only on stage 50 before prestiging, because the content of the geodes scales with you stage so it is most effective to buy them on stage 50.`,
                
                `Buying traits is a good way of levelling up the new/lower-level cards on higher stages because the shop always gives you the newest cards that don’t have an upgrade available. Only buy trait cards if you have mutagen left over.`,
                
                `The mutagen part of the shop is not needed because completing all the missions should provide you with enough mutagen to get you through the entire mesozoic valley. Of course speeding up your progress with darwinium using these offers is possible.\`\`\``].join('\n\n')
            }
        ])
        .setFooter(`Thanks to Jojoseis#0001 for making this guide! :D`);
        message.channel.send({ embeds: [embed], files: [currentLogo] });
}