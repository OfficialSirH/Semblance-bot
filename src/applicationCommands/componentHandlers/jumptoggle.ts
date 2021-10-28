import { ButtonData } from '#lib/interfaces/Semblance';
import { Message, MessageComponentInteraction } from 'discord.js';
import { Jump } from '#models/Jump';

export const run = async (interaction: MessageComponentInteraction, { action }: ButtonData) => {
  if (action == 'enable') {
    await Jump.findOneAndUpdate({ guild: interaction.guild.id }, { active: true });
    await interaction.update({ content: "You've successfully enabled Jump!", components: [] });
  } else if (action == 'disable') {
    await Jump.findOneAndUpdate({ guild: interaction.guild.id }, { active: false });
    await interaction.update({ content: "You've successfully disabled Jump!", components: [] });
  } else (interaction.message as Message).delete();
};
