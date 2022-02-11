import { Embed } from 'discord.js';
import type { User, Snowflake } from 'discord.js';
import { prefix, randomColor } from '#constants/index';
import type { SlashCommand } from '#lib/interfaces/Semblance';
import { currentPrice } from '#src/constants/commands';

export default {
  permissionRequired: 0,
  run: async (interaction, { client }) => {
    const playerId: Snowflake = interaction.options.getUser('user')
      ? interaction.options.getUser('user').id
      : interaction.member.user.id;
    const statsHandler = await client.db.game.findUnique({ where: { player: playerId } });
    if (!statsHandler)
      return interaction.reply({
        content: interaction.options.getUser('user')
          ? 'This user does not exist'
          : `You have not created a game yet; if you'd like to create a game, use \`${prefix}game create\``,
        ephemeral: true,
      });
    const nxtUpgrade = await currentPrice(client, statsHandler);
    let player: User;
    if (interaction.user.id == playerId) player = interaction.user;
    else player = await client.users.fetch(playerId);
    const embed = new Embed()
      .setTitle(`${player.username}'s gamestats`)
      .setAuthor(player.tag, player.displayAvatarURL())
      .setColor(randomColor)
      .setThumbnail(player.displayAvatarURL())
      .addFields([
        { name: 'Level', value: statsHandler.level.toString() },
        { name: 'Random-Bucks', value: statsHandler.money.toString() },
        {
          name: 'Percent Increase',
          value: statsHandler.percentIncrease.toString(),
        },
        { name: 'Next Upgrade Cost', value: nxtUpgrade.toString() },
        { name: 'Idle Profit', value: statsHandler.profitRate.toString() },
      ])
      .setFooter({ text: 'Remember to vote for Semblance to gain a production boost!' });
    return interaction.reply({ embeds: [embed] });
  },
} as SlashCommand;
