import { Category, randomColor } from '#constants/index';
import { Command } from '#structures/Command';
import { EmbedBuilder, chatInputApplicationCommandMention } from '@discordjs/builders';

export default class MiscHelp extends Command {
  public override name = 'mischelp';
  public override description = 'List all miscelaneous commands';
  public override category = [Category.help];

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const { client } = interaction;

    const funCommands = client.stores
      .get('commands')
      .filter(c => c.category === Category.fun)
      .map(c => `**${c.name}**`);
    const utilityCommands = client.stores
      .get('commands')
      .filter(c => c.category === Category.utility)
      .map(c => `**${c.name}**`);
    const semblanceCommands = client.stores
      .get('commands')
      .filter(c => c.category === Category.semblance)
      .map(c => `**${c.name}**`);

    const embed = new EmbedBuilder()
      .setTitle('Miscellaneous Commands')
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(randomColor)
      .setAuthor(interaction.user)
      .setDescription(
        `All of the available commands below can be found through the ${chatInputApplicationCommandMention(
          'help',
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
          this.client.cache.data.applicationCommands.find(c => c.name === 'help')?.id!,
        )} command via the \`query\` option.`,
      )
      .addFields(
        {
          name: '**-> Fun Commands**',
          value: funCommands.join(', '),
          inline: true,
        },
        {
          name: '**-> Utility Commands**',
          value: utilityCommands.join(', '),
          inline: true,
        },
        {
          name: '**-> Semblance-related Commands**',
          value: semblanceCommands.join(', '),
          inline: true,
        },
      );
    return { embeds: [embed] };
  }
}
