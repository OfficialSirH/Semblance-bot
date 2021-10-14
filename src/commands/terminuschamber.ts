import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import type { Command } from '@semblance/lib/interfaces/Semblance';
const { currentLogo, terminusChamber } = config;

export default {
    description: "Details on how to obtain each node within the Terminus Chamber",
    category: 'game',
    subcategory: 'main',
    permissionRequired: 0,
    aliases: ['terminus', 'chamber'],
    checkArgs: () => true,
    run: (_client, message) => run(message)
} as Command<'game'>;

const run = async (message: Message) => {
    let embed = new MessageEmbed()
        .setTitle("Terminus Chamber")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setThumbnail(currentLogo.name)
        .setImage(terminusChamber.name)
        .setDescription(['**Yellow Cube** - ||Explore the Mesozoic Valley||',
            '**Purple Cube** - ||Unlock Singularity for the first time||',
            '**Light Pink Cube** - ||Unlock the human brain||',
            '**Light Blue Cube** - ||Obtain/Evolve Neoaves||',
            '**Blue Cube** - ||Unlock Cetaceans||',
            '**Lime Green Cube** - ||Unlock Crocodilians||',
            '**Orange Cube** - ||Unlock Feliforms||',
            '**Red Cube** - ||Terraform Mars||'].join('\n'));
    message.channel.send({ embeds: [embed], files: [currentLogo, terminusChamber] });
}
