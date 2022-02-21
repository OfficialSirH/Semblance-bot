import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { prefix, randomColor } from '#constants/index';
import { currentLogo, darwinium } from '#config';
import { Command } from '@sapphire/framework';
import type { SapphireClient } from '@sapphire/framework';

export default {
  description: 'Info on contest winners',
  category: 'game',
  subcategory: 'other',
  aliases: ['limericks'],
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message, args) => run(client, message, args),
} as Command<'game'>;

const run = async (client: SapphireClient, message: Message, args: string[]) => {
  const contests = ['limericks'];
  if (args[0] == 'limericks') return limericks(message);
  message.channel.send({
    embeds: [
      new Embed()
        .setTitle('Contests')
        .setColor(randomColor)
        .setDescription(
          `All of the available contest-related commands are: \n${contests
            .map((i: string) => `\`${prefix}contest ${i}\``)
            .join('\n')}`,
        ),
    ],
  });
};

function limericks(message: Message) {
  const embed = new Embed()
    .setTitle('Limericks Contest winners')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
    .setDescription(
      `**1st Place(2000 ${darwinium}):** Jean_Xontric - \n` +
        'Before the dinosaur ran out of luck,\n' +
        'he lectured a four-legged, furry duck: \n' +
        '"We could rule as best mates,\n' +
        'hatched from amniote traits, \n' +
        'yet like all other mammals - you suck!"\n\n' +
        `**2nd Place(1000 ${darwinium}):** SampeDrako - \n` +
        'Tengo un murci\u00E9lago\n' +
        'Dale ajo y acaba ciego\n' +
        'Un trago de sangre\n' +
        'y se pone alegre\n' +
        'Nuestro amigo noct\u00EDvago\n\n' +
        `**3rd Place(500 ${darwinium}):** Daenerys - \n` +
        'Quite tall stands the mighty elephant\n' +
        "What's more, it's also intelligent\n" +
        'Enjoys a banana\n' +
        'In the dry savannah\n' +
        "This beast's huge trunk sure is elegant\n\n" +
        `**Honorable Mention(200 ${darwinium}):** Theorian - \n` +
        'From stars we come and to stars we go\n' +
        'The entropy of life can never slow\n' +
        'With great peculiarity\n' +
        'From cell to singularity \n' +
        'Playing our parts in the greatest show',
    )
    .setFooter({ text: 'Let the hunger gam-- I mean Limericks Contest- begin!' });
  message.channel.send({ embeds: [embed], files: [currentLogo] });
}
