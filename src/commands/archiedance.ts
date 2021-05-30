import { MessageEmbed, Message } from 'discord.js';
import config from '@semblance/config';    
import { Semblance } from '../structures';
const { archieDance } = config; 

module.exports = {
    description: "View epic videos of Archie dancing.",
    category: 'fun',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
    let embed = new MessageEmbed()
        .setTitle("Dancing Archie/Jotaru")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription("Click the link above for the epic 3 minute video with Archie and Jotaru dancing, which I made as suggested by McScrungledorf#6020. "
        + "Also, below is a short video of Archie's dance animation from the game :P")
        .setURL("https://drive.google.com/file/d/1twLIqvEG-wwZJFmhtSERWBM5KoJ3zmkg/view?usp=sharing");
    message.channel.send({ embed, files: [archieDance] });
}