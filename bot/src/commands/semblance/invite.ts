import { Command } from '#structures/Command';
import { Category, randomColor } from '#constants/index';

export default class Invite extends Command {
  public override name = 'invite';
  public override description = 'Gets an invite link for the bot and support server.';
  public override category = [Category.semblance];

  public override async chatInputRun(res: FastifyReply, interaction: APIApplicationCommandInteraction) {
    const { client, user } = interaction;
    const embed = new EmbedBuilder()
      .setTitle('Bot Invite')
      .setColor(randomColor)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor(user)
      .setDescription(
        `Invite me to your server be clicking [here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=274878295040&scope=bot+applications.commands).` +
          '\n\n[Semblance Support server](https://discord.gg/XFMaTn6taf)',
      )
      .setFooter({ text: 'Spread the word about Semblance!' });

    await interaction.reply({ embeds: [embed] });
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
    };
  }
}
