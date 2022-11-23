import { type Message, EmbedBuilder } from 'discord.js';
import { Category, randomColor, Subcategory, attachments } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Mvunlocks extends Command {
  public override name = 'mvunlocks';
  public override description = 'Information about the unlocking of each reptile and bird';
  public override fullCategory = [Category.game, Subcategory.mesozoic];
  public override aliases = ['reptiles', 'birds', 'mvunlock'];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new EmbedBuilder()
      .setTitle('Reptiles and Birds')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setThumbnail(attachments.currentLogo.name)
      .setColor(randomColor)
      .setDescription(
        'The following generators are unlocked by achieving the following ranks in the Mesozoic Valley\n' +
          [
            'Rank 3 - [Turtle](https://cell-to-singularity-evolution.fandom.com/wiki/Turtle)',
            'Rank 6 - [Crocodilia](https://cell-to-singularity-evolution.fandom.com/wiki/Crocodilia)',
            'Rank 10 - [Lizard](https://cell-to-singularity-evolution.fandom.com/wiki/Lizard)',
            'Rank 15 - [Snake](https://cell-to-singularity-evolution.fandom.com/wiki/Snake)',
            'Rank 23 - [Galliformes](https://cell-to-singularity-evolution.fandom.com/wiki/Galliformes)',
            'Rank 28 - [Anseriformes](https://cell-to-singularity-evolution.fandom.com/wiki/Anseriformes)',
            'Rank 33 - [Paleognathae](https://cell-to-singularity-evolution.fandom.com/wiki/Paleognathae)',
            'Rank 38 - [Neoaves](https://cell-to-singularity-evolution.fandom.com/wiki/Neoaves)',
          ]
            .map(t => `**${t}**`)
            .join('\n'),
      );
    return { embeds: [embed], files: [attachments.currentLogo.attachment] };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}