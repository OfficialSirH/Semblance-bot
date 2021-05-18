const { MessageEmbed } = require('discord.js'),
    {randomColor} = require('@semblance/constants'),
    {currentLogo} = require('../config').default;

module.exports = {
    description: 'Information about the unlocking of each reptile and bird',
    category: 'main',
    aliases: ['reptiles', 'birds', 'mvunlock'],
    usage: {
        "": ""
    },
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    const embed = new MessageEmbed()
        .setTitle("Reptiles and Birds")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .attachFiles(currentLogo)
        .setImage(currentLogo.name)
        .setColor(randomColor)
        .setDescription('The following generators are unlocked by achieving the following ranks in the Mesozoic Valley'+
        [
            'Rank 3 - [Turtle](https://cell-to-singularity-evolution.fandom.com/wiki/Turtle)',
            'Rank 6 - [Crocodilia](https://cell-to-singularity-evolution.fandom.com/wiki/Crocodilia)',
            'Rank 10 - [Lizard](https://cell-to-singularity-evolution.fandom.com/wiki/Lizard)',
            'Rank 15 - [Snake](https://cell-to-singularity-evolution.fandom.com/wiki/Snake)',
            'Rank 23 - [Galliformes](https://cell-to-singularity-evolution.fandom.com/wiki/Galliformes)',
            'Rank 28 - [Anseriformes](https://cell-to-singularity-evolution.fandom.com/wiki/Anseriformes)',
            'Rank 33 - [Paleognathae](https://cell-to-singularity-evolution.fandom.com/wiki/Paleognathae)',
            'Rank 38 - [Neoaves](https://cell-to-singularity-evolution.fandom.com/wiki/Neoaves)',
        ].map(t=>`**${t}**`).join('\n'));
    message.channel.send(embed);
}