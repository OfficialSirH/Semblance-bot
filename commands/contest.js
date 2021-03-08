const { MessageEmbed } = require('discord.js'), {randomColor} = require('../constants'),
    { currentLogo, prefix, darwinium } = require('../config.js'); 

module.exports = {
    description: "Info on limericks winners",
    usage: {
        "": ""
    },
    aliases: ['limericks', 'limerick'],
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args, identifier) => {
    switch (identifier) {
        case 'limerick':
        case 'limericks':
            return limericks(message);
        default: 
            message.channel.send(new MessageEmbed().setTitle("Contests").setColor(randomColor)
            .setDescription(`All of the available contest-related commands are: \n${module.exports.aliases.map(i => `\`${prefix}${i}\``).join('\n')}`));
    }
}

function limericks(message) {
    let embed = new MessageEmbed()
        .setTitle('Limericks Contest winners')
        .setColor(randomColor)
        .attachFiles(currentLogo)
        .setThumbnail("attachment://Current_Logo.png")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(`**1st Place(2000 ${darwinium}):** Jean_Xontric - \n` +
                            `Before the dinosaur ran out of luck,\n`+
                            `he lectured a four-legged, furry duck: \n`+
                            `"We could rule as best mates,\n`+
                            `hatched from amniote traits, \n`+
                            `yet like all other mammals - you suck!"\n\n` +
                        `**2nd Place(1000 ${darwinium}):** SampeDrako - \n` +
                            `Tengo un murci\u00E9lago\n` +
                            `Dale ajo y acaba ciego\n` +
                            `Un trago de sangre\n` +
                            `y se pone alegre\n` +
                            `Nuestro amigo noct\u00EDvago\n\n` +
                        `**3rd Place(500 ${darwinium}):** Daenerys - \n` +
                            `Quite tall stands the mighty elephant\n` +
                            `What's more, it's also intelligent\n` +
                            `Enjoys a banana\n` +
                            `In the dry savannah\n` +
                            `This beast's huge trunk sure is elegant\n\n` +
                        `**Honorable Mention(200 ${darwinium}):** Theorian - \n` +
                            `From stars we come and to stars we go\n` +
                            `The entropy of life can never slow\n` +
                            `With great peculiarity\n` +
                            `From cell to singularity \n` +
                            `Playing our parts in the greatest show`
            )
        .setFooter('Let the hunger gam-- I mean Limericks Contest- begin!');
    message.channel.send(embed);
}