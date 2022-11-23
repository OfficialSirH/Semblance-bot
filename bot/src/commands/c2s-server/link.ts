import { Category, GuildId, UserId } from '#constants/index';
import { Command, type ApplicationCommandRegistry } from '@sapphire/framework';
import { type ChatInputCommandInteraction, ApplicationCommandOptionType } from 'discord.js';
import { DiscordLinkAPI } from '#structures/DiscordLinkAPI';
import { createHmac } from 'crypto';

export default class Link extends Command {
  constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'link',
      description: 'Link C2S data with your Discord Id.',
      fullCategory: [Category.dm],
    });
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    const playerId = interaction.options.getString('playerid');
    const playerEmail = interaction.options.getString('playeremail');
    const playerToken = interaction.options.getString('playertoken', true);

    if (playerId && playerEmail)
      return interaction.reply({ content: 'Please only provide either playerId or playerEmail.', ephemeral: true });

    if (playerEmail) {
      const discordLinkClient = new DiscordLinkAPI(Buffer.from(playerEmail + ':' + playerToken).toString('base64'));

      await interaction.deferReply({ ephemeral: true });

      const response = await discordLinkClient.linkDiscordUser({ discord_id: interaction.user.id });

      let msg: string;
      if (typeof response !== 'string')
        msg = 'message' in response ? response.message : 'Successfully linked your account.';
      else msg = response;

      return interaction.editReply(msg);
    }

    if (!playerId) return interaction.reply({ content: 'Please provide a player id.', ephemeral: true });

    const { user } = interaction;

    const token = createHmac('sha1', process.env.USERDATA_AUTH).update(playerId).update(playerToken).digest('hex');
    const dataAlreadyExists = await interaction.client.db.userData.findUnique({ where: { token } });
    if (dataAlreadyExists)
      return interaction.reply({
        content: `The provided data seems to already exist, which means this data is already linked to a discord account, if you feel this is false, please DM the owner(<@!${UserId.sirh}>).`,
        ephemeral: true,
      });

    await interaction.client.db.userData
      .upsert({
        where: { discord_id: user.id },
        update: { token },
        create: { discord_id: user.id, token },
      })
      .then(async () => {
        this.container.logger.info(`${user.tag}(${user.id}) successfully linked their C2S data.`);
        await interaction.reply({
          content: 'The link was successful, now you can use the Discord button in-game to upload your progress.',
          ephemeral: true,
        });
      })
      .catch(() =>
        interaction.reply({
          content: "An error occured, either you provided incorrect input or something randomly didn't want to work.",
          ephemeral: true,
        }),
      );
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'playertoken',
            type: ApplicationCommandOptionType.String,
            description: 'The player token bound to your Game Transfer account.',
            required: true,
          },
          {
            name: 'playerid',
            type: ApplicationCommandOptionType.String,
            description: 'Your player id.',
            required: false,
          },
          {
            name: 'playeremail',
            type: ApplicationCommandOptionType.String,
            description: 'The email bound to your Game Transfer account.',
            required: false,
          },
        ],
      },
      {
        guildIds: [GuildId.cellToSingularity],
      },
    );
  }
}
