import { Categories, randomColor } from '#constants/index';
import { type ApplicationCommandRegistry, type Args, Command } from '@sapphire/framework';
import { type CommandInteraction, type Message, MessageEmbed, ApplicationCommandOptionType } from 'discord.js';

function createAnswer(question: string) {
  const randomizedChoice = Math.ceil(Math.random() * 20);
  let description = `Question: ${question}\nAnswer: `;
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
  return description;
}

export default class EightBall extends Command {
  public override name = '8ball';
  public override description = 'Ask the 8ball a question.';
  public override fullCategory = [Categories.fun];

  public override async messageRun(message: Message, args: Args) {
    const choice = await args.pickResult('string');

    if (!choice.success) return message.channel.send('You need to provide a question for the 8ball to answer.');

    const embed = new MessageEmbed()
      .setTitle('8ball')
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
      .setColor(randomColor)
      .setDescription(createAnswer(choice.value));

    await message.reply({ embeds: [embed] });
  }

  public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
    const question = interaction.options.getString('question', true);

    const user = interaction.member.user;
    const embed = new MessageEmbed()
      .setTitle('8ball')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setColor(randomColor);
    embed.setDescription(createAnswer(question));
    return interaction.reply({ embeds: [embed] });
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
      options: [
        {
          name: 'question',
          type: 'STRING',
          description: 'The question to ask the 8ball.',
          required: true,
        },
      ],
    });
  }
}
