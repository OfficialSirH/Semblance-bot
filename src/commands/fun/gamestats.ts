import { ApplicationCommandOptionType, type ChatInputCommandInteraction, Embed } from 'discord.js';
import { Categories, prefix, randomColor } from '#constants/index';
import { currentPrice } from '#src/constants/commands';
import { type ApplicationCommandRegistry, Command } from '@sapphire/framework';

export default class Gamestats extends Command {
  public override name = 'gamestats';
  public override description = "Displays a user's game stats for Semblance Idle-Game.";
  public override fullCategory = [Categories.fun];

  public async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    let user = interaction.options.getUser('user');
    if (!user) user = interaction.user;

    const statsHandler = await interaction.client.db.game.findUnique({ where: { player: user.id } });
    if (!statsHandler)
      return interaction.reply({
        content:
          user.id != interaction.user.id
            ? 'This user does not exist'
            : `You have not created a game yet; if you'd like to create a game, use \`${prefix}game create\``,
        ephemeral: true,
      });
    const nxtUpgrade = await currentPrice(interaction.client, statsHandler);
    const embed = new Embed()
      .setTitle(`${user.username}'s gamestats`)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: 'Level', value: statsHandler.level.toString() },
        { name: 'Random-Bucks', value: statsHandler.money.toString() },
        {
          name: 'Percent Increase',
          value: statsHandler.percentIncrease.toString(),
        },
        { name: 'Next Upgrade Cost', value: nxtUpgrade.toString() },
        { name: 'Idle Profit', value: statsHandler.profitRate.toString() },
      )
      .setFooter({ text: 'Remember to vote for Semblance to gain a production boost!' });
    return interaction.reply({ embeds: [embed] });
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
      options: [
        {
          name: 'user',
          description: 'The user to display stats for.',
          type: ApplicationCommandOptionType.User,
        },
      ],
    });
  }
}
