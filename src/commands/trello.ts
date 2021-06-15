import { Message, MessageEmbed } from 'discord.js'; 
import { randomColor } from '@semblance/constants';
import { Semblance } from '../structures';

module.exports = {
  description: "Provides link to Semblance's Trello Board",
  category: 'semblance',
  usage: {
      "": ""
  },
  permissionRequired: 0,
  checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
  let embed = new MessageEmbed()
    .setDescription("[Semblance's Trello board](https://trello.com/b/Zhrs5AaN/semblance-project)")
    .setColor(randomColor);
  message.channel.send({ embeds: [embed] });
} 
