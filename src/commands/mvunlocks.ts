import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Semblance } from '../structures';
const { currentLogo } = config;

module.exports = {
    description: 'Information about the unlocking of each reptile and bird',
    category: 'main',
    aliases: ['reptiles', 'birds', 'mvunlock'],
    usage: {
        "": ""
    },
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    const embed = new MessageEmbed()
        .setTitle("Reptiles and Birds")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setThumbnail(currentLogo.name)
        .setColor(randomColor)
        .setDescription('The following generators are unlocked by achieving the following ranks in the Mesozoic Valley\n'+
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
    message.channel.send({ embeds: [embed], files: [currentLogo] });
}