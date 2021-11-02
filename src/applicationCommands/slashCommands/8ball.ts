import type { User } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { randomColor } from '#constants/index';
import type { SlashCommand } from '#lib/interfaces/Semblance';

export default {
  permissionRequired: 0,
  run: interaction => {
    if (!interaction.options.getString('question'))
      return interaction.reply('Ask any question with this command and Semblance will answer.');
    const randomizedChoice = Math.ceil(Math.random() * 20),
      user = interaction.member.user as User;
    const embed = new MessageEmbed()
      .setTitle('8ball')
      .setAuthor(user.tag, user.displayAvatarURL())
      .setColor(randomColor);
    let description = `Question: ${interaction.options.get('question').value}\nAnswer: `;
    if (randomizedChoice == 1) description += 'It is certain';
    if (randomizedChoice == 2) description += 'It is decidely so.';
    if (randomizedChoice == 3) description += 'Without a doubt';
    if (randomizedChoice == 4) description += 'Yes - definitely.';
    if (randomizedChoice == 5) description += 'You may rely on it.';
    if (randomizedChoice == 6) description += 'As I see it, yes.';
    if (randomizedChoice == 7) description += 'Most likely.';
    if (randomizedChoice == 8) description += 'Outlook good.';
    if (randomizedChoice == 9) description += 'Yes.';
    if (randomizedChoice == 10) description += 'Signs point to yes.';
    if (randomizedChoice == 11) description += 'Reply hazy, try again.';
    if (randomizedChoice == 12) description += 'Ask again later.';
    if (randomizedChoice == 13) description += 'Better not tell you now.';
    if (randomizedChoice == 14) description += 'Cannot predict now.';
    if (randomizedChoice == 15) description += 'Concentrate and ask again.';
    if (randomizedChoice == 16) description += "Don't count on it.";
    if (randomizedChoice == 17) description += 'My reply is no.';
    if (randomizedChoice == 18) description += 'My sources say no.';
    if (randomizedChoice == 19) description += 'Outlook not so good.';
    if (randomizedChoice == 20) description += 'Very doubtful.';
    embed.setDescription(description);
    return interaction.reply({ embeds: [embed] });
  },
} as SlashCommand;
