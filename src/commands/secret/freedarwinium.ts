import { Categories } from '#src/constants';
import { Command } from '@sapphire/framework';
import { Embed, Message } from 'discord.js';

export default class Freedarwinium extends Command {
  public override name = 'freedarwinium';
  public override fullCategory = [Categories.secret];

  public override sharedRun() {
    const embed = new Embed().setTitle('Secret').setURL('https://rb.gy/enaq3a');
    return { embeds: [embed], ephemeral: true };
  }

  public override async messageRun(message: Message) {
    await message.delete().catch(() => null);
    await message.reply(this.sharedRun());
  }
}
