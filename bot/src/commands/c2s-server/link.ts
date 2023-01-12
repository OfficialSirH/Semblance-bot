import { Category, GuildId } from '#constants/index';
import { Command } from '#structures/Command';
import { DiscordLinkAPI } from '#structures/DiscordLinkAPI';
import {
  type APIChatInputApplicationCommandInteraction,
  ApplicationCommandOptionType,
  type APIApplicationCommandInteractionDataStringOption,
  MessageFlags,
  type RESTPostAPIApplicationCommandsJSONBody,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';
export default class Link extends Command {
  constructor(client: Command.Requirement) {
    super(client, {
      name: 'link',
      description: 'Link C2S data with your Discord Id.',
      fullCategory: [Category.c2sServer],
    });
  }

  public override async chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandInteraction) {
    const [playerEmail, playerToken] =
      interaction.data.options?.map(option => (option as APIApplicationCommandInteractionDataStringOption).value) ?? [];

    if (!playerEmail || !playerToken)
      return this.client.api.interactions.reply(res, {
        content: 'Please provide both playerEmail and playerToken.',
        flags: MessageFlags.Ephemeral,
      });

    if (playerEmail) {
      const discordLinkClient = new DiscordLinkAPI(Buffer.from(playerEmail + ':' + playerToken).toString('base64'));

      await this.client.api.interactions.deferReply(res, { flags: MessageFlags.Ephemeral });

      const response = await discordLinkClient.linkDiscordUser({ discord_id: interaction.member?.user.id as string });

      let msg: string;
      if (typeof response !== 'string')
        msg = 'message' in response ? response.message : 'Successfully linked your account.';
      else msg = response;

      return this.client.api.interactions.editReply(interaction, { content: msg });
    }
  }

  public override data() {
    return {
      command: {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'playeremail',
            type: ApplicationCommandOptionType.String,
            description: 'The email bound to your Game Transfer account.',
            required: true,
          },
          {
            name: 'playertoken',
            type: ApplicationCommandOptionType.String,
            description: 'The player token bound to your Game Transfer account.',
            required: true,
          },
        ],
      } satisfies RESTPostAPIApplicationCommandsJSONBody,
      guildIds: [GuildId.cellToSingularity],
    };
  }
}
