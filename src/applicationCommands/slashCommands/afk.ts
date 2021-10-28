import { MessageEmbed } from 'discord.js';
import { randomColor } from '#constants/index';
import { Afk } from '#models/Afk';
import type { SlashCommand } from '#lib/interfaces/Semblance';

export default {
  permissionRequired: 0,
  run: async interaction => {
    const reason = interaction.options.getString('reason') ? interaction.options.getString('reason') : 'Just because';
    const user = interaction.member.user;
    const afkHandler = await Afk.findOne({ userId: user.id });
    if (!afkHandler) await new Afk({ userId: user.id, reason }).save();
    else await Afk.findOneAndUpdate({ userId: user.id }, { $set: { reason } });

    const embed = new MessageEmbed()
      .setTitle('AFK')
      .setColor(randomColor)
      .setDescription(`You are now afk ${user} \n` + `Reason: ${reason}`);
    interaction.reply({ embeds: [embed] });
  },
} as SlashCommand;
