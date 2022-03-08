import type { RPSGame } from '#lib/interfaces/rps';
import type { ButtonInteraction, Snowflake } from 'discord.js';
import { Collection, MessageEmbed } from 'discord.js';
import { choiceToOutcome, countdownGIF } from '#constants/commands';
import { componentInteractionDefaultParser } from '#constants/components';
import { InteractionHandler, type PieceContext, InteractionHandlerTypes } from '@sapphire/framework';
import type { ParsedCustomIdData } from 'Semblance';

export const rpsGames: Collection<Snowflake, RPSGame> = new Collection();
export default class RPS extends InteractionHandler {
  public constructor(context: PieceContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      name: 'rps',
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction) {
    return componentInteractionDefaultParser(this, interaction, true);
  }

  public override async run(interaction: ButtonInteraction<'cached'>, data: ParsedCustomIdData) {
    const { user } = interaction;

    if (!rpsGames.has(data.id) || (rpsGames.get(data.id).opponent.id != user.id && data.id != user.id))
      return await interaction.deferUpdate();

    const currentGame = rpsGames.get(data.id);
    if (
      (data.id == user.id && !!currentGame.player.choice) ||
      (currentGame.opponent.id == user.id && !!currentGame.opponent.choice)
    )
      return await interaction.deferUpdate();

    if (user.id == data.id) currentGame.player.choice = data.action;
    else currentGame.opponent.choice = data.action;
    rpsGames.set(data.id, currentGame);
    await interaction.reply({
      content: `You've successfully chosen ${data.action}!`,
      ephemeral: true,
    });

    const updatedGame = rpsGames.get(data.id),
      { player, opponent } = updatedGame;

    if (!!player.choice && !!opponent.choice) {
      const playerVictory = choiceToOutcome(player.choice, opponent.choice),
        embed = new MessageEmbed().setThumbnail(countdownGIF),
        description = `${player.tag} chose ${player.choice} and ${opponent.tag} chose ${opponent.choice}`;

      if (playerVictory == 'tie')
        embed.setDescription(`${player.tag} and ${opponent.tag} both chose ${player.choice}`).setTitle('tie!');
      else if (playerVictory) embed.setDescription(description).setTitle(`${player.tag} wins!`);
      else embed.setDescription(description).setTitle(`${opponent.tag} wins!`);

      await interaction.message.edit({
        content: null,
        embeds: [embed.setColor(0x36393f)],
        components: [],
      });
      clearTimeout(updatedGame.timeout);
      rpsGames.delete(data.id);
    } else
      await interaction.message.edit(
        `Awaiting for **${user.id == data.id ? updatedGame.opponent.tag : updatedGame.player.tag}**`,
      );
  }
}
