import type { SlashCommand } from '#lib/interfaces/Semblance';
import { UserData } from '#models/UserData';
import { createHmac } from 'crypto';

export default {
  permissionRequired: 0,
  run: async (interaction, { options }) => {
    const playerId = options.getString('playerId', true),
      playerToken = options.getString('playerToken', true),
      { user } = interaction;
    const token = createHmac('sha1', process.env.USERDATA_AUTH).update(playerId).update(playerToken).digest('hex');
    const dataAlreadyExists = await UserData.findOne({ token });
    if (dataAlreadyExists)
      return interaction.reply(
        'The provided data seems to already exist, which means this data is already linked to a discord account, if you feel this is false, please DM the owner(SirH).',
      );
    const updatedUser = !!(await UserData.findOneAndUpdate(
      { discordId: user.id },
      { $set: { token, edited_timestamp: Date.now() } },
      { new: true },
    ));
    if (updatedUser) {
      console.log(`${user.tag}(${user.id}) successfully linked their C2S data.`);
      return interaction.reply(
        'The link was successful, now you can use the Discord button in-game to upload your progress.',
      );
    }
    const newUser = new UserData({ token, discordId: user.id });
    newUser.save(function (err) {
      if (err)
        return interaction.reply(
          "An error occured, either you provided incorrect input or something randomly didn't want to work.",
        );
      interaction.reply('The link was successful, now you can use the Discord button in-game to upload your progress.');
    });
  },
} as SlashCommand;
