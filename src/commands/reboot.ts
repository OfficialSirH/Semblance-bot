import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Semblance } from '../structures';
const { currentLogo } = config;

module.exports = {
    description: "",
    category: 'game',
    subcategory: 'main',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    let embed = new MessageEmbed()
        .setTitle("Reboot")
        .setColor(randomColor)
        .setThumbnail(currentLogo.name)
        .setDescription('**Reboot\'s location:** You can find the "Simulation Reboot" by  clicking on the (metabit) bar under your currency (entropy/ideas).\n'+
                       '**The importance of rebooting your simulation:** you gain metabits from your stimulation, which in order to use them and unlock their potential you need to reboot your stimulation.'+
                        'rebooting also offers a lot of speed boost and rewards');
    message.channel.send({ embeds: [embed], files: [currentLogo] });
}
