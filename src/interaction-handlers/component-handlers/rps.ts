import type { RPSGame } from '#lib/interfaces/rps';
import type { Message, Snowflake } from 'discord.js';
import { Collection, Embed } from 'discord.js';
import { choiceToOutcome, countdownGIF } from '#constants/commands';

export default class HANDLER_NAME extends InteractionHandler {
  public constructor(context: PieceContext, options: InteractionHandler.Options) {
    super(context, {
      ...options,
      name: 'HANDLER_NAME',
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public override parse(interaction: ButtonInteraction) {
    return componentInteractionDefaultParser(this, interaction);
  }

  // public override async run(interaction: ButtonInteraction, data: Omit<CustomIdData, 'command'>) {

  // }
}

export const rpsGames: Collection<Snowflake, RPSGame> = new Collection();
export default {
  allowOthers: true,
  buttonHandle: async (interaction, { action, id }) => {
    const { user } = interaction,
      message = interaction.message as Message;
    if (!rpsGames.has(id) || (rpsGames.get(id).opponent.id != user.id && id != user.id))
      return await interaction.deferUpdate();
    const currentGame = rpsGames.get(id);
    if (
      (id == user.id && !!currentGame.player.choice) ||
      (currentGame.opponent.id == user.id && !!currentGame.opponent.choice)
    )
      return await interaction.deferUpdate();

    if (user.id == id) currentGame.player.choice = action;
    else currentGame.opponent.choice = action;
    rpsGames.set(id, currentGame);
    await interaction.reply({
      content: `You've successfully chosen ${action}!`,
      ephemeral: true,
    });
    const updatedGame = rpsGames.get(id),
      { player, opponent } = updatedGame;

    if (!!player.choice && !!opponent.choice) {
      const playerVictory = choiceToOutcome(player.choice, opponent.choice),
        embed = new Embed().setThumbnail(countdownGIF),
        description = `${player.tag} chose ${player.choice} and ${opponent.tag} chose ${opponent.choice}`;

      if (playerVictory == 'tie')
        embed.setDescription(`${player.tag} and ${opponent.tag} both chose ${player.choice}`).setTitle('tie!');
      else if (playerVictory) embed.setDescription(description).setTitle(`${player.tag} wins!`);
      else embed.setDescription(description).setTitle(`${opponent.tag} wins!`);

      await message.edit({
        content: null,
        embeds: [embed.setColor(0x36393f)],
        components: [],
      });
      clearTimeout(updatedGame.timeout);
      rpsGames.delete(id);
    } else await message.edit(`Awaiting for **${user.id == id ? updatedGame.opponent.tag : updatedGame.player.tag}**`);
  },
} as ComponentHandler;
