import { c2sGuildId, sirhId } from '#config';
import type { ApplicationCommandRegistry, Args } from '@sapphire/framework';
import { Command } from '@sapphire/framework';
import type { CommandInteraction, Message } from 'discord.js';
import { Categories } from '#constants/index';
import { DiscordLinkAPI } from '#structures/DiscordLinkAPI';
import { createHmac } from 'crypto';

export default class Link extends Command {
  constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'link',
      description: 'Link C2S data with your Discord Id.',
      fullCategory: [Categories.dm],
    });
  }

  public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
    const playerEmail = interaction.options.getString('playeremail', true);
    const playerToken = interaction.options.getString('playertoken', true);
    const isEmail = interaction.options.getBoolean('isemail');

    if (isEmail) {
      const discordLinkClient = new DiscordLinkAPI(Buffer.from(playerEmail + ':' + playerToken).toString('base64'));

      const response = await discordLinkClient.linkDiscordUser({ discord_id: interaction.user.id });

      let msg: string;
      if (typeof response !== 'string')
        msg = 'message' in response ? response.message : 'Successfully linked your account.';
      else msg = response;

      return interaction.reply({ content: msg, ephemeral: true });
    }
    const { user } = interaction;

    const token = createHmac('sha1', process.env.USERDATA_AUTH).update(playerEmail).update(playerToken).digest('hex');
    const dataAlreadyExists = await interaction.client.db.userData.findUnique({ where: { token } });
    if (dataAlreadyExists)
      return interaction.reply({
        content: `The provided data seems to already exist, which means this data is already linked to a discord account, if you feel this is false, please DM the owner(<@!${sirhId}>).`,
        ephemeral: true,
      });

    await interaction.client.db.userData
      .upsert({
        where: { discord_id: user.id },
        update: { token },
        create: { discord_id: user.id, token },
      })
      .then(async () => {
        console.log(`${user.tag}(${user.id}) successfully linked their C2S data.`);
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

  public override async messageRun(message: Message, args: Args) {
    const isMember = !!(await message.client.guilds.cache
      .get(c2sGuildId)
      .members.fetch(message.author.id)
      .catch(() => null));
    if (!isMember)
      return message.channel.send(
        'You need to be a member of the Cell to Singularity community server to use this command.',
      );

    const playerEmail = await args.pickResult('string');
    if (!playerEmail.success) return message.reply('You need to provide a player email.');
    const playerToken = await args.pickResult('string');
    if (!playerToken.success) return message.reply('You need to provide a player token.');
    const isEmailPick = await args.pickResult('boolean');
    let isEmail: boolean;
    if (!isEmailPick.success) isEmail = false;
    else isEmail = isEmailPick.value;

    if (message.channel.type == 'DM') await message.delete();

    if (isEmail) {
      const discordLinkClient = new DiscordLinkAPI(Buffer.from(playerEmail + ':' + playerToken).toString('base64'));

      const response = await discordLinkClient.linkDiscordUser({ discord_id: message.author.id });

      let msg: string;
      if (typeof response !== 'string') msg = 'message' in response ? response.message : 'Successfully linked account.';
      else msg = response;

      return message.channel.send(msg);
    }

    const token = createHmac('sha1', process.env.USERDATA_AUTH)
      .update(playerEmail.value)
      .update(playerToken.value)
      .digest('hex');
    const dataAlreadyExists = await message.client.db.userData.findUnique({ where: { token } });
    if (dataAlreadyExists)
      return message.channel.send(
        `The provided data seems to already exist, which means this data is already linked to a discord account, if you feel this is false, please DM the owner(<@!${sirhId}>).`,
      );

    await message.client.db.userData
      .upsert({
        where: { discord_id: message.author.id },
        update: { token },
        create: { discord_id: message.author.id, token },
      })
      .then(async () => {
        console.log(`${message.author.tag}(${message.author.id}) successfully linked their C2S data.`);
        if (message.channel.type != 'DM') {
          await message.channel.send(
            `Successfully linked your C2S data, ${message.author.tag}, but please remember to use this link command in DMs next time, having to delete your message every time is such a hassle.`,
          );
          await message.delete().catch(() => null);
        } else
          await message.channel.send(
            'The link was successful, now you can use the Discord button in-game to upload your progress.',
          );
      })
      .catch(() =>
        message.channel.send(
          "An error occured, either you provided incorrect input or something randomly didn't want to work.",
        ),
      );

    if (message.channel.type != 'DM') await message.delete().catch(() => null);
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'playeremail',
            type: 'STRING',
            description: 'The email bound to your Game Transfer account.',
            required: true,
          },
          {
            name: 'playertoken',
            type: 'STRING',
            description: 'The player token bound to your Game Transfer account.',
            required: true,
          },
          {
            name: 'isemail',
            type: 'BOOLEAN',
            description: 'indicates if the playeremail option is an email or a player id.',
            required: false,
          },
        ],
      },
      {
        guildIds: [c2sGuildId],
        idHints: ['973689073623498803'],
      },
    );
  }
}
