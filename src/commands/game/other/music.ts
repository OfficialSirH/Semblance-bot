import { type Message, MessageEmbed } from 'discord.js';
import { Category, randomColor, Subcategory, attachments } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Music extends Command {
  public name = 'music';
  public description = 'Provides the links to the in-game music on the Fandom wiki and on Spotify.';
  public fullCategory = [Category.game, Subcategory.other];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new MessageEmbed()
      .setTitle('Music')
      .setColor(randomColor)
      .setThumbnail(attachments.currentLogo.name)
      .setDescription(
        [
          `Here's a link to the music, ${user.username}`,
          '[Fandom Wiki](https://cell-to-singularity-evolution.fandom.com/wiki/music)',
          '[Spotify Link](https://open.spotify.com/playlist/6XcJkgtRFpKwoxKleKIOOp?si=uR4gzciYQtKiXGPwY47v6w)',
        ].join('\n'),
      );
    return { embeds: [embed], files: [attachments.currentLogo] };
  }

  public async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}
