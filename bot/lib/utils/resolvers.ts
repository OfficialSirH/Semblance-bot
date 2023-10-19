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
import type { Attachy } from '#structures/Attachy';
import { FormDataEncoder, type FormDataLike } from 'form-data-encoder';
import { Readable } from 'node:stream';

// this probably works properly, not sure of the root issue for the issues that came from the encoder's length being wrong
export const resolveBodyWithAttachments = async (
  resolveableBody: RESTPostAPIChannelMessageJSONBody & { files?: Attachy[] },
) => {
  if (!resolveableBody?.allowed_mentions) resolveableBody.allowed_mentions = { parse: [] };

  if (!resolveableBody.files?.length) return { body: resolveableBody };

  const form = new FormData();
  for (const [index, file] of resolveableBody.files.entries()) {
    form.append(`files[${index}]`, new Blob([await file.data()]), file.name);
  }

  resolveableBody.attachments = resolveableBody.files.map((file, index) => ({
    id: index.toString(),
    filename: file.name,
  }));

  delete resolveableBody.files;

  form.append('payload_json', JSON.stringify(resolveableBody));

  const encoder = new FormDataEncoder(form as unknown as FormDataLike);

  return {
    headers: encoder.headers,
    body: Readable.from(encoder.encode()),
  };
};

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
