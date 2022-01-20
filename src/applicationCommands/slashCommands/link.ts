import type { SlashCommand } from '#lib/interfaces/Semblance';
import { createHmac } from 'crypto';

export default {
  permissionRequired: 0,
  run: async (interaction, { options, client }) => {
    const playerId = options.getString('playerId', true),
      playerToken = options.getString('playerToken', true),
      { user } = interaction;
    const token = createHmac('sha256', process.env.USERDATA_AUTH).update(playerId).update(playerToken).digest('hex');
    const dataAlreadyExists = await client.db.userData.findUnique({ where: { token } });
    if (dataAlreadyExists)
      return interaction.reply({
        content:
          'The provided data seems to already exist, which means this data is already linked to a discord account, if you feel this is false, please DM the owner(SirH).',
        ephemeral: true,
      });
    const updatedUser = await client.db.userData.update({ where: { discordId: user.id }, data: { token } });
    if (updatedUser) {
      console.log(`${user.tag}(${user.id}) successfully linked their C2S data.`);
      return interaction.reply({
        content: 'The link was successful, now you can use the Discord button in-game to upload your progress.',
        ephemeral: true,
      });
    }
    const newUser = await client.db.userData.create({
      data: {
        token,
        discordId: user.id,
      },
    });
    if (newUser)
      return interaction.reply({
        content: 'The link was successful, now you can use the Discord button in-game to upload your progress.',
        ephemeral: true,
      });

    interaction.reply({
      content: "An error occured, either you provided incorrect input or something randomly didn't want to work.",
      ephemeral: true,
    });
  },
} as SlashCommand;
