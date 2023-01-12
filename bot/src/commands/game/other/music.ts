import { Category, randomColor, SubCategory, attachments } from '#constants/index';
import { Command } from '#structures/Command';

export default class Music extends Command {
  public name = 'music';
  public description = 'Provides the links to the in-game music on the Fandom wiki and on Spotify.';
  public category = [Category.game, SubCategory.other];

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const embed = new EmbedBuilder()
      .setTitle('Music')
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo)
      .setDescription(
        [
          `Here's a link to the music, ${interaction.user.username}`,
          '[Fandom Wiki](https://cell-to-singularity-evolution.fandom.com/wiki/music)',
          '[Spotify Link](https://open.spotify.com/playlist/6XcJkgtRFpKwoxKleKIOOp?si=uR4gzciYQtKiXGPwY47v6w)',
        ].join('\n'),
      );
    return { embeds: [embed], files: [attachments.currentLogo.attachment] };
  }
}
