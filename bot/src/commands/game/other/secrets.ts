import { Category, randomColor, SubCategory } from '#constants/index';
import { Command } from '#structures/Command';
import { chatInputApplicationCommandMention, EmbedBuilder } from '@discordjs/builders';
import { MessageFlags } from '@discordjs/core';
import type { FastifyReply } from 'fastify';

export default class Secrets extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'secrets',
      description: 'View the secrets of the game.',
      fullCategory: [Category.game, SubCategory.other],
    });
  }

  public override async chatInputRun(res: FastifyReply) {
    const help = this.client.cache.data.applicationCommands.find(c => c.name === 'help')!;

    const embed = new EmbedBuilder()
      .setTitle('Secret Achievements')
      .setColor(randomColor)
      .setDescription(
        [
          '1. Make an ape dab by tapping on it numerous times.',
          '2. Make an archosaur, named Archie, dance by tapping the archosaur with a tuxedo/suit.',
          `3. Unlock all sharks, *check ${chatInputApplicationCommandMention(
            help.name,
            help.id,
          )} and input 'sharks' into the option*.`,
          '**Land Garden:**',
          '4. Click the paradise bird, an all brown bird with a blue face.',
          '5. While your game camera is still focused on the paradise bird, wait till the bird flies near a small island with the darwin bust statue and click the island.',
          "6. At the back of the Galapagos island, there is a special portal that will take you to the roblox game, completing it will give you a special code (in case you don't want to play it: ||BEAGLE||, but we'll be sad) which you need to input on the plate that is located on the Darwin bust statue.",
          "7. In the savannah section of the land garden, activate camera mode and point the camera to top down so then you can see the top of the mountain ledges, near the lions and elephants you'll find... *sniff*... Archie's bones :(",
          "8. Between the savannah and the jungle section where the river splits them apart, you'll find the Amazonian Dolphin.",
          "9. If you have your camera positioned at the pond with the ducks at an angle pointing towards the left side of the mountain, you'll see a **Tibetan Fox** on the other side of the waterfall from the Ibex.",
          'You can also see the fox on the right side of the mountain if you have your camera positioned behind the 2 humans.',
          '10. Buy Disco Flatworms from the logit shop and tap on the flatworms to make them dance.',
          '**Ancient Civilization Garden:**',
          '11. Buy Dog domestication from Augmentations store and pet the doggo which is near the Stone age mark with a human.',
          "12. Buy Cat Domestication from Augmentations store and pet the kitty which is sitting on Queen Cleopatra's lap.",
          '13. Buy Trojan Horse from Augmentations store, you can find it in front of the bronze age mark and catch the solider inside of it.',
          "14. Buy Pyramids from Augmentations store, you can find them outside of the main island, behind them you'll find a sarcophagus, just click it.",
          "15. Buy Great Library from Augmentations store, It's in front of the iron age mark, so you'll need to use map mode or photo mode to see it, repeatably click it to light it up on fire.",
          '**Speedrunning:**',
          '16. Reach Singularity within 5 minutes.',
          '17. Reach Singularity within 120 seconds!',
          '**Global**',
          '18. Find all of the dodos: https://discord.com/channels/488478892873744385/488478893586645004/1034451108216713307',
        ].join('\n'),
      );

    await this.client.api.interactions.reply(res, { embeds: [embed.toJSON()], flags: MessageFlags.Ephemeral });
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
    };
  }
}
