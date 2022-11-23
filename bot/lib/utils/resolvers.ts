import { onlyUnique } from '#constants/index';
import { type Snowflake, type Guild, type GuildMember, ChannelType } from 'discord.js';

export const getRole = (search: string | Snowflake, guild: Guild) =>
  guild.roles.cache.find(r => r.name == search) ??
  guild.roles.cache.find(r => r.name.toLowerCase() == search.toLowerCase()) ??
  guild.roles.cache.get(getId(search) as Snowflake);

export const getMember = (search: string | Snowflake, guild: Guild) =>
  guild.members.cache.find(m => search == m.user.tag) ??
  guild.members.cache.find(m => search.toLowerCase() == m.user.tag.toLowerCase()) ??
  guild.members.cache.find(m => search == m.displayName) ??
  guild.members.cache.find(m => search.toLowerCase() == m.displayName.toLowerCase()) ??
  guild.members.cache.get(getId(search) as Snowflake);

export const getChannel = (search: string | Snowflake, guild: Guild) => {
  const channels = guild.channels.cache.filter(ch => ch.type == ChannelType.GuildText && ch.viewable);
  return (
    false ??
    channels.find(ch => search.toLowerCase() == ch.name.toLowerCase()) ??
    channels.get(getId(search) as Snowflake)
  );
};

export const getMembers = (searches: string[] | Snowflake[], guild: Guild) => {
  const members: GuildMember[] = [];
  for (const search of searches) {
    const member = getMember(search, guild);
    if (member) members.push(member);
    else {
      const role = getRole(search, guild);
      console.log(role);
      if (role) role.members.forEach((member: GuildMember) => members.push(member));
    }
  }

  return members
    .map(m => m.id)
    .filter(onlyUnique)
    .map(id => members.find(m => m.id == id));
};

export const getUser = async (search: string | Snowflake, guild: Guild) => {
  const member = getMember(search, guild);
  if (member) return member.user;
  else
    try {
      return await guild.client.users.fetch(search as Snowflake);
    } catch (e) {
      return undefined;
    }
};

const getId = (search: string | Snowflake) => (search.match(/[0-9]+/) ?? [''])[0];
