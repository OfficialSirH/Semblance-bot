import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { Categories, randomColor, Subcategories } from '#constants/index';
import { Command } from '@sapphire/framework';

export default class Secret extends Command {
  public override name = 'secret';
  public override description = 'secret';
  public override fullCategory = [Categories.game, Subcategories.other];
  public override aliases = ['secrets'];

  public override sharedRun() {
    const embed = new MessageEmbed()
      .setTitle('Secret Achievements')
      .setColor(randomColor)
      .setDescription(
        [
          '1. Make an ape dab by tapping on it numerous times.',
          '2. Make an archosaur, named Archie, dance by tapping the archosaur with a tuxedo/suit.',
          `3. Unlock all sharks, *check ${this.container.client.user}sharks*.`,
          '**Secrets in the land garden:**',
          '4. Click the paradise bird, an all brown bird with a blue face.',
          '5. While your game camera is still focused on the paradise bird, wait till the bird flies near a small island with the darwin bust statue and click the island.',
          "6. In the savannah section of the land garden, activate camera mode and point the camera to top down so then you can see the top of the mountain ledges, near the lions and elephants you'll find... *sniff*... Archie's bones :(",
          "7. Between the savannah and the jungle section where the river splits them apart, you'll find the Amazonian Dolphin.",
          "8. If you have your camera positioned at the pond with the ducks at an angle pointing towards the left side of the mountain, you'll see a **Tibetan Fox** on the other side of the waterfall from the Ibex.",
          'You can also see the fox on the right side of the mountain if you have your camera positioned behind the 2 humans.',
          '**Secrets of the speedruns:**',
          '9. Reach Singularity within 5 minutes.',
          '10. Reach Singularity within 120 seconds!',
        ].join('\n'),
      );
    return { embeds: [embed], ephemeral: true };
  }

  public override async messageRun(message: Message) {
    await message.author
      .send(this.sharedRun())
      .catch(() => message.reply("I can't DM you! You're probably blocking DMs."));
  }
}
