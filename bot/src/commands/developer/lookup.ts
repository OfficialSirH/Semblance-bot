import { getRole, getChannel, getUser } from '#lib/utils/resolvers';
import { Command } from '#structures/Command';
import type { APIInvite, APIUser } from 'discord-api-types/v10';
import { Category, PreconditionName, onlyUnique, randomColor } from '#constants/index';
import { request } from 'undici';
import {
  type RESTPostAPIApplicationCommandsJSONBody,
  type APIApplicationCommandInteraction,
  ApplicationCommandOptionType,
  ChannelType,
  type Snowflake,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';

export default class Lookup extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'lookup',
      description: 'Lookup something unknown, like an Id or an invite, and hopefully get the meaning behind it!',
      fullCategory: [Category.developer],
      preconditions: [PreconditionName.OwnerOnly],
    });
  }

  public override data() {
    return {
      command: {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'unknown_item',
            description: 'The item you want to lookup.',
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      } satisfies RESTPostAPIApplicationCommandsJSONBody,
    };
  }

  public override async chatInputRun(res: FastifyReply, interaction: APIApplicationCommandInteraction) {
    const unknownItem = interaction.options.getString('unknown_item');
    if (!unknownItem) return interaction.reply('Please provide a valid ID or invite!');

    const role = getRole(unknownItem, interaction.guild);
    if (role) return interaction.reply(`✅ This Id is a role Id for the role ${role.name}.`);

    const channel = getChannel(unknownItem, interaction.guild);
    if (channel) return interaction.reply(`✅ This Id is a channel Id for the channel ${channel}.`);

    // user lookup
    try {
      const user = await getUser(unknownItem, interaction.guild);
      if (user) {
        if (user.bot) {
          const botblock = (await request(`https://botblock.org/api/bots/${user.id}`).then(res =>
            res.body.json(),
          )) as BotBlock;
          if (botblock.discriminator == '0000')
            return interaction.reply(
              `✅ This Id is a bot Id of ${user.username}#${user.discriminator} (${user.id}). Unfortunately, this bot is not listed on any of BotBlock's bot lists.`,
            );

          const fields: EmbedField[] = [],
            add = (values: Record<string, unknown>) => {
              for (const name in values)
                fields.push({
                  name,
                  value: (typeof values[name] != 'string' ? values[name]?.toString() : <string>values[name]) || 'N/A',
                  inline: true,
                });
            };

          const lists = Object.keys(botblock.list_data)
            .filter(l => botblock.list_data[l][1] == 200 && !botblock.list_data[l].error)
            .map(l => botblock.list_data[l][0]);

          const listsWithDescriptions = lists.filter(l => Object.keys(l).find(k => k.toLowerCase().includes('short')));
          const descriptions = listsWithDescriptions
            .map(l => l[Object.keys(l).find(k => k.toLowerCase().includes('short')) as keyof typeof l])
            .sort((a, b) => (b?.length || 0) - (a?.length || 0));
          if (descriptions[0]) add({ Description: descriptions[0] });

          const prefixes = lists
            .filter(l => l.prefix)
            .map(l => l.prefix)
            .sort((a, b) => (b?.length || 0) - (a?.length || 0));
          add({ Prefix: prefixes[0] ? `\`${prefixes[0]}\`` : 'Unknown' });

          if (botblock.server_count) add({ 'Server Count': botblock.server_count });

          add({
            Invite: `${
              botblock.invite ? `[Invite with permissions](${botblock.invite})\n` : ''
            }[Invite without permissions](https://discordapp.com/oauth2/authorize?client_id=${botblock.id}&scope=bot)`,
          });

          if (lists.find(l => l.library)) add({ Library: lists.find(l => l.library)?.library });

          const websites: Record<string, number> = {};
          for (const website of lists.filter(l => l.website).map(l => l.website))
            if (!websites[website || '']) websites[website || ''] = 1;
            else websites[website || ''] += 1;
          const websiteKeys = Object.keys(websites).sort((a, b) => websites[b] - websites[a]);
          if (websiteKeys[0]) add({ Website: websiteKeys[0] });

          const allTags = lists
            .filter(l => l.tags)
            .map(l => l.tags?.filter(t => typeof t == 'string').join(','))
            .join(',')
            .split(',');
          if (allTags.length) {
            const tags = allTags.filter(t => t.length).filter(onlyUnique);
            if (tags.length) add({ Tags: tags.join(', ') });
          }

          let owners: string[] | User[] = await Promise.all(
            botblock.owners
              .filter(o => !o.includes('#'))
              .filter(onlyUnique)
              .map(u => getUser(u, interaction.guild) as Promise<User>),
          );
          owners = owners.filter(o => o).map(o => `${o.username}#${o.discriminator} (${o.id})`);
          if (owners.length > 1) add({ Owners: owners.join('\n') });
          else add({ Owner: owners[0] });

          return interaction.reply({
            content: `✅ This Id is a bot Id of ${user.username}#${user.discriminator} (${user.id}).`,
            embeds: [
              {
                fields,
                thumbnail: user.avatar
                  ? {
                      url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=2048`,
                    }
                  : undefined,
                color: randomColor,
              },
            ],
          });
        } else
          return interaction.reply(`✅ This Id is a user Id of ${user.username}#${user.discriminator} (${user.id}).`);
      }
    } catch (e) {
      this.container.logger.error(e);
    }

    // invite lookup
    try {
      const _invite = await interaction.client.fetchInvite(unknownItem);
      if (_invite) {
        const invite = (await request(
          'https://discordapp.com/api/v8/invites/' + _invite.code + '?with_counts=true',
        ).then(res => res.body.json())) as APIInvite;

        const fields: EmbedField[] = [],
          add = (values: Record<string, unknown>, inline = true) => {
            for (const name in values)
              fields.push({
                name,
                value: (typeof values[name] != 'string' ? values[name]?.toString() : <string>values[name]) || 'N/A',
                inline,
              });
          };

        add({
          Guild: `${invite.guild?.name} (${invite.guild?.id})`,
          Channel: `${invite.channel?.name} (${
            invite.channel?.type && (invite.channel.type as ChannelType.GuildText) !== 0
              ? `${invite.channel.type}/`
              : ''
          }${invite.channel?.id})`,
          Members: `${invite.approximate_presence_count} online, ${invite.approximate_member_count} total`,
        });

        if (invite.inviter)
          add({
            Inviter: `${invite.inviter.username}#${invite.inviter.discriminator} (${invite.inviter.bot ? 'bot/' : ''}${
              invite.inviter.id
            })`,
          });
        if (invite.guild?.vanity_url_code)
          add({
            'Original Vanity URL': `https://discord.gg/${invite.guild.vanity_url_code}`,
          });
        if (invite.guild?.description) add({ Description: invite.guild.description });
        if (invite.guild?.verification_level)
          add({
            'Verification Level': [
              'None',
              'Verified email',
              'Verified email and 5 minutes on Discord',
              'Verified email and 10 minutes on server',
              'Verified phone number',
            ][invite.guild.verification_level],
          });
        if (invite.guild?.features.length) add({ Features: invite.guild.features.join(', ') }, true);

        return interaction.reply({
          content: '✅ This Id is a Discord invite.',
          embeds: [
            {
              title: 'Invite Lookup',
              description: `Information from the invite \`${invite.code}\``,
              fields,
              image: invite.guild?.banner
                ? {
                    url: `https://cdn.discordapp.com/banners/${invite.guild.id}/${invite.guild.banner}.jpg?size=4096`,
                  }
                : undefined,
              thumbnail: invite.guild?.icon
                ? {
                    url: `https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.jpg?size=4096`,
                  }
                : undefined,
              color: randomColor,
            },
          ],
        });
      }
    } catch (e) {}

    // emoji lookup
    try {
      const res = await request(`https://cdn.discordapp.com/emojis/${unknownItem}.png`);
      if (res.statusCode == 200)
        return interaction.reply(`✅ This Id is an emoji Id: https://cdn.discordapp.com/emojis/${unknownItem}.png`);
    } catch (e) {}

    // message lookup
    const channels = interaction.guild.channels.cache
      .filter(ch => [ChannelType.GuildAnnouncement, ChannelType.GuildText].includes(ch.type))
      .map(c => c) as TextChannel[];
    for (const ch of channels)
      try {
        const m = await ch.messages.fetch(unknownItem as Snowflake);
        if (m)
          return interaction.reply(
            `✅ This Id is a message Id: <https://discordapp.com/channels/${m.guild.id}/${m.channel.id}/${m.id}>`,
          );
      } catch (e) {}

    return interaction.reply(
      `🚫 I don't know what the Id \`${unknownItem}\` is coming from. Maybe the deep abyss known as The Beyond?`,
    );
  }
}

interface BotBlock extends APIUser {
  owners: string[];
  list_data: ListData;
  server_count: number;
  invite: string;
}

type ListData = Record<string, ListItem>;
interface ListItem {
  error?: string;
  [0]: {
    short?: string;
    prefix?: string;
    library?: string;
    website?: string;
    tags?: string[] | unknown[];
  };
  [1]: number;
}
