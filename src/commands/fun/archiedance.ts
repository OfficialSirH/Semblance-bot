import type { Message } from 'discord.js';
import { Embed } from 'discord.js';
import { archieDance } from '#config';
import { Command } from '@sapphire/framework';
import { Categories } from '#src/constants';

export default class ArchieDance extends Command {
  public override name = 'archiedance';
  public override description = 'View epic videos of Archie dancing.';
  public override fullCategory = [Categories.fun];

  public override async messageRun(message: Message) {
    const embed = new Embed()
      .setTitle('Dancing Archie/Jotaru')
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
      .setDescription(
        'Click the link above for the epic 3 minute video with Archie and Jotaru dancing, which I made as suggested by McScrungledorf#6020. ' +
          "Also, above is a short video of Archie's dance animation from the game :P",
      )
      .setURL('https://drive.google.com/file/d/1twLIqvEG-wwZJFmhtSERWBM5KoJ3zmkg/view?usp=sharing');
    await message.channel.send({ embeds: [embed], files: [archieDance] });
  }
}