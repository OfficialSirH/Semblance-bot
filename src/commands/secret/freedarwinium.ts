import { Category } from '#constants/index';
import { Command } from '@sapphire/framework';
import { type Message, MessageEmbed } from 'discord.js';

export default class Freedarwinium extends Command {
  public override name = 'freedarwinium';
  public override fullCategory = [Category.secret];

  public override sharedRun() {
    const embed = new MessageEmbed().setTitle('Secret').setURL('https://rb.gy/enaq3a');
    return { embeds: [embed], ephemeral: true };
  }

  public override async messageRun(message: Message) {
    await message.delete().catch(() => null);
    await message.reply(this.sharedRun());
  }
}
