import type { AutocompleteHandler } from '#lib/interfaces/Semblance';
import { clamp } from '#lib/utils/math';

export const run: AutocompleteHandler['run'] = async (interaction, options, client) => {
  const reports = (await client.db.report.findMany({})).map(report => report.bugId);
  const queriedId = clamp(Math.floor(options.getFocused() as number), 1, reports.length);

  return interaction.respond(
    reports
      .slice(queriedId - 1, clamp(queriedId + 4, 0, reports.length))
      .map(id => ({ name: id.toString(), value: id })),
  );
};
