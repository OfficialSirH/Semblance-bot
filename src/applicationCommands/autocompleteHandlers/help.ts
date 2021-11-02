import type { AutocompleteHandler } from '#lib/interfaces/Semblance';

export const run: AutocompleteHandler['run'] = async (interaction, options, client) => {
  const query = options.getFocused() as string;

  const queriedInfoStartsWith = client.infoBuilders
    .map((_, keys) => keys)
    .filter(name => name.startsWith(query))
    .map(name => ({ name, value: name }))
    .slice(0, 25);
  const queriedInfoContains = client.infoBuilders
    .map((_, keys) => keys)
    .filter(name => !name.startsWith(query) && name.includes(query))
    .map(name => ({ name, value: name }))
    .slice(0, 25 - queriedInfoStartsWith.length);

  if (queriedInfoStartsWith.length == 0 && queriedInfoContains.length == 0) return;

  interaction.respond([...queriedInfoStartsWith, ...queriedInfoContains]);
};
