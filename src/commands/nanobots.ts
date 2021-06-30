import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Semblance } from '../structures';
const { currentLogo, nanobots } = config;

module.exports = {
  description: "Provides details on nanobots and whatever else about those cute critters",
  category: 'game',
  subcategory: 'main',
  aliases: ['nbts', 'nanobot'],
  usage: {
    "": ""
  },
  permissionRequired: 0,
  checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
  let embed = new MessageEmbed()
    .setTitle("Nanobots")
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setImage(nanobots.name)
    .setDescription(["Nanobots are little dudes that can help with either auto-upgrading or clicking. These little dudes are obtainable through rebooting and spending metabits for them, which you can buy up to 12(First Image).",
          "While ready(Image \"ready\"), the nanobots last for 2 minutes, which costs 2 darwinium to recharge them when they're in cooldown(Image \"Cooldown\"), and can be toggled between clicker(Image \"Actively Clicking\") or upgrader(Image \"Actively Upgrading\") mode.",
          "Depending on where your camera is on the tech tree, your nanobots will try to upgrade everything within your camera region, so whether you want your nanobots to upgrade something specific",
          "or you want to speed through the advancements you'll have to make sure your camera is covering the region or item you want upgraded."].join(" "))
    .setFooter('Thanks to SampeDrako for creating this beautifully better designed image representing nanobots!');
  message.channel.send({ embeds: [embed], files: [currentLogo, nanobots] });
}
