import { onlyUnique } from '#constants/index';
import {
  type Snowflake,
  ChannelType,
  type RESTPostAPIChannelMessageJSONBody,
  Routes,
  type RESTPostAPIChannelMessageResult,
  type APIGuild,
  type GatewayGuildCreateDispatchData,
  type APIGuildMember,
  type APIUser,
} from '@discordjs/core';
import type { Client } from '#structures/Client';
import type { REST } from '@discordjs/rest';

export const sendMessage = async (client: Client, channel: Snowflake, body: RESTPostAPIChannelMessageJSONBody) =>
  (await client.rest.post(Routes.channelMessages(channel), { body })) as Promise<RESTPostAPIChannelMessageResult>;

export const getRole = (search: string | Snowflake, guild: APIGuild) =>
  guild.roles.find(r => r.name == search) ??
  guild.roles.find(r => r.name.toLowerCase() == search.toLowerCase()) ??
  guild.roles.find(r => r.id === getId(search));

export const getMember = (rest: REST, search: string | Snowflake, guild: APIGuild) =>
  rest.get(Routes.guildMember(guild.id, search)) as Promise<APIGuildMember>;

export const getChannel = (search: string | Snowflake, guild: APIGuild & GatewayGuildCreateDispatchData) => {
  const channels = guild.channels.filter(ch => ch.type == ChannelType.GuildText);
  return (
    false ??
    channels.find(ch => search.toLowerCase() == ch.name?.toLowerCase()) ??
    channels.find(ch => ch.id === getId(search))
  );
};

export const getMembers = async (rest: REST, searches: string[] | Snowflake[], guild: APIGuild) => {
  const members: APIGuildMember[] = [];
  for (const search of searches) {
    const member = await getMember(rest, search, guild);
    if (member) members.push(member);
  }

  return members
    .map(m => m.user?.id)
    .filter(onlyUnique)
    .map(id => members.find(m => m.user?.id == id));
};

export const getUser = async (rest: REST, search: string | Snowflake, guild: APIGuild) => {
  const member = await getMember(rest, search, guild);
  if (member) return member.user;
  else
    try {
      return rest.get(Routes.user(search)) as Promise<APIUser>;
    } catch (e) {
      return undefined;
    }
};

const getId = (search: string | Snowflake) => (search.match(/[0-9]+/) ?? [''])[0];
