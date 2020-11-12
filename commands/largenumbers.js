const { MessageEmbed } = require('discord.js'), { currentLogo } = require('../config.js'), randomColor = require('../constants/colorRandomizer.js');

module.exports = {
    description: "Provides details of shorter ways to using large numbers as input.",
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    let embed = new MessageEmbed()
        .setTitle('Large Numbers')
        .attachFiles(currentLogo)
        .setThumbnail('attachment://Current_Logo.png')
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setDescription("the way to use all of the names when using the calculator commands are: M(Million), B(Billion), T(Trillion), Qa(Quadrillion), Qi(Quintrillion), Sx(Sextillion), Sp(Septillion), Oc(Octillion)," +
            " No(Nonillion), Dc(Decillion), UnDc(UnDecillion), DuoDc(DuoDecillion), treDc(TreDecillion), QaDc(QuattuorDecillion), QiDc(QuinDecillion), SxDc(SexDecillion), SpDc(SeptenDecillion)," +
            " OcDc(OctoDecillion), NoDc(NovemDecillion), and V(Vigintillion). All these names are case insensitive, meaning you don't have to type them in the exact correct capilization for it to work;" +
            " In case someone uses the British format for these names, please note that these are in US format, so they aren't the exact same as yours and if you would like to know what the names are in US format" +
            " here's a link: http://www.thealmightyguru.com/Pointless/BigNumbers.html")
        .setFooter('Large Numbers go brrrr...');
    message.channel.send(embed);
}
