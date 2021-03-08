const { MessageEmbed, MessageAttachment } = require('discord.js'), { metabit } = require('../config');

module.exports = {
    description: "A detailed explanation of how to obtain Metabits faster",
    usage: {
        "": ""
    },
    aliases: ["metabit"],
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async(client, message, args) => {
    let metabitAttachment = new MessageAttachment("./images/emojis/Metabit.png", "Metabit.png"),
    embed = new MessageEmbed()
        .setTitle("Ways to earn Metabits faster")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor("RANDOM")
        .attachFiles([metabitAttachment])
        .setThumbnail("attachment://Metabit.png")
        .setDescription([["Metabits are basically earned from the total accumulation of entropy and ideas(with a bit of an equation involved),",
        "which means you would want to increase your production rate for entropy and ideas to make Metabits faster, but how do I do that though?"].join(' '),

        ["**Main Simulation:**",
        "Unlock and buy generators that produce more to increase Metabit production"].join('\n'),
        
        ["**Mesozoic Valley:**",
        "- Each rank in the MV provides a **10%** boost to your production speed while each Prestige in the MV provides a **50%** boost!",
        "- You will unlock Neoaves and other generators when you progress in MV, which also would grant a buff in the speed of Metabit production."].join('\n'),
        
        ["**Metabits:**",
        "Wait... Metabits increase my production speed, which in turn increases my Metabit production?",
        "Yes, yes it does, but the production speed boost from Metabits are received after you collect your earned Metabits(i.e. rebooting your simulation)."].join('\n'),
        
        ["**Reality Engine:**",
        "There are upgrades in the Reality Engine that specifically boost your production speed, which you can total up to **2105%** if you got all of the upgrades, now that's a lot! :D"].join('\n'),
        
        "If you'd like to see the effects all of these have on overall production speed, use the slash command, `/metaspeedcalc`, to play around with the values!"].join('\n\n'));
    message.channel.send(embed);
}