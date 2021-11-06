import type { ComponentHandler } from '#lib/interfaces/Semblance';
import type { TextBasedChannels } from 'discord.js';
import { MessageActionRow, MessageEmbed } from 'discord.js';

export default {
  allowOthers: true,
  buttonHandle: async (interaction, { action, id }, { permissionLevel, client }) => {
    if (permissionLevel == 0) return interaction.reply("You don't have permission to use this button!");
    if (!['accept', 'deny', 'silent-deny'].includes(action)) return interaction.reply("Something ain't working right");
    (interaction.message.components as MessageActionRow[]).forEach(component =>
      component.components.forEach(c => c.setDisabled(true)),
    );
    interaction.update({
      content: `${action != 'accept' ? 'denied' : 'accepted'} by ${interaction.user}`,
      components: interaction.message.components as MessageActionRow[],
    });
    if (action == 'silent-deny') return;
    const user = await client.users.fetch(id);
    if (action == 'accept') {
      user.send(
        'Your suggestion has been accepted! ' +
          'Note: This does not mean that your suggestion is guranteed to be added in the game or implemented into the server(depending on the type of suggestion). ' +
          'It just means that your suggestion has been accepted into being shown in the suggestions channel where the team may consider your suggestion.',
      );
      return (interaction.guild.channels.cache.find(c => c.name == 'suggestions') as TextBasedChannels).send({
        embeds: [
          new MessageEmbed()
            .setAuthor(user.tag, user.displayAvatarURL())
            .setDescription(interaction.message.embeds[0].description),
        ],
      });
    }
    if (action == 'deny')
      user.send(
        "Your suggestion has been denied. We deny reports if they're either a duplicate, already in-game, " +
          'have no connection to what the game is supposed to be(i.e. "pvp dinosaur battles with Mesozoic Valley dinos"), or aren\'t detailed enough. ' +
          "If you believe this is a mistake, please contact the staff team. You can also edit then resend your suggestion if you think it was a good suggestion that wasn't " +
          ` written right. suggestion: \`\`\`\n${interaction.message.embeds[0].description}\`\`\``,
      );
  },
} as ComponentHandler;
