import { attachments, Category } from '#constants/index';
import { Command } from '#structures/Command';
import { EmbedBuilder } from '@discordjs/builders';

export default class ArchieDance extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'archiedance',
      description: 'View epic videos of Archie dancing.',
      fullCategory: [Category.fun],
    });
  }

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const embed = new EmbedBuilder()
      .setTitle('Dancing Archie/Jotaru')
      .setAuthor(interaction.user)
      .setDescription(
        'Click the link above for the epic 3 minute video with Archie and Jotaru dancing, which I made as suggested by McScrungledorf#6020. ' +
          "Also, above is a short video of Archie's dance animation from the game :P",
      )
      .setURL('https://drive.google.com/file/d/1twLIqvEG-wwZJFmhtSERWBM5KoJ3zmkg/view?usp=sharing');

    return { embeds: [embed.toJSON()], files: [attachments.archieDance.attachment] };
  }
}
