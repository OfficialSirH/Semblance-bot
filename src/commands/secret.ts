import { MessageEmbed } from 'discord.js';
import type { Message } from 'discord.js';
import { prefix, randomColor } from '#constants/index';
import type { Command } from '#lib/interfaces/Semblance';
import { Semblance } from '#structures/Semblance';

export default {
  description: 'Secret',
  category: 'game',
  subcategory: 'other',
  aliases: ['secrets'],
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message, args) => run(client, message, args),
} as Command<'game'>;

const run = async (client: Semblance, message: Message, args: string[]) => {
  message.delete();
  if (args[0] == 'fun') return fun(message);
  const embed = new MessageEmbed()
    .setTitle('Secret Achievements')
    .setColor(randomColor)
    .setDescription(
      [
        '1. Make an ape dab by tapping on it numerous times.',
        '2. Make an archosaur, named Archie, dance by tapping the archosaur with a tuxedo/suit.',
        `3. Unlock all sharks, *check $${prefix}sharks*.`,
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
  message.author
    .send({ embeds: [embed] })
    .catch(() =>
      message.channel.send(
        `${message.author}, something went wrong while trying to send the message, you likely have your DMs closed, preventing you from receiving the message`,
      ),
    );
};

async function fun(message: Message) {
  const embed = new MessageEmbed().setTitle('Secret').setURL('https://rb.gy/enaq3a');
  message.author.send({ embeds: [embed] });
}
