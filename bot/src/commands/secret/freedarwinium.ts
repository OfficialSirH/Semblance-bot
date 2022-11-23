import { Category } from '#constants/index';
import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';

export default class Freedarwinium extends Command {
  public override name = 'freedarwinium';
  public override fullCategory = [Category.secret];

  public override sharedRun() {
    const embed = new EmbedBuilder().setTitle('Secret').setURL('https://rb.gy/enaq3a');
    return { embeds: [embed], ephemeral: true };
  }
}
