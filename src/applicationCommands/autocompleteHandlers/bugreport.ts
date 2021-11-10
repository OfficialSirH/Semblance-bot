import type { AutocompleteHandler } from '#lib/interfaces/Semblance';
import { clamp } from '#lib/utils/math';
import { Report } from '#models/Report';

export const run: AutocompleteHandler['run'] = async (interaction, options) => {
  const reports = (await Report.find({})).map(report => report.bugId);
  const queriedId = clamp(Math.floor(options.getFocused() as number), 1, reports.length);

  return interaction.respond(
    reports
      .slice(queriedId - 1, clamp(queriedId + 4, 0, reports.length))
      .map(id => ({ name: id.toString(), value: id })),
  );
};
