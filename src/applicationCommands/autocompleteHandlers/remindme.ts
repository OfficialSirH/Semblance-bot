import type { TimeLengthsString } from "@semblance/lib/interfaces/remindme";
import { clamp } from "@semblance/lib/utils/math";
import { timeInputRegex } from "@semblance/src/constants";
import type { ApplicationCommandOptionChoice, AutocompleteInteraction, CommandInteractionOptionResolver } from "discord.js";


export async function run(interaction: AutocompleteInteraction, options: CommandInteractionOptionResolver<AutocompleteInteraction>) {
    const focusedOption = options.getFocused() as string;
    if (parseInt(focusedOption)) {
        if (focusedOption.length <= 2) {
            const responseOptions = ['m', 'h', 'd', 'w', 'M'].map(o => ({ name: `${focusedOption}${o}`, value: `${focusedOption}${o}` }));
            return interaction.respond(responseOptions);
        }
        return;
    }
    const timeAmount = timeInputRegex.exec(focusedOption);
    const { groups: { months = '0', weeks = '0', days = '0', hours = '0', minutes = '0' } } = timeAmount as TimeLengthsString;
    const timeValues = [months, weeks, days, hours, minutes].map((t, i) => { 
        return { type: ['M', 'w', 'd', 'h', 'm'][i], value: parseInt(t) };
    }).filter(t => t.value > 0);
    if (timeValues.length === 0) return;
    const responseOptions: ApplicationCommandOptionChoice[] = [];
    for (let i = 0; i < clamp(99 - timeValues.at(-1).value, 0, 5) + 1; i++) {
        responseOptions.push({
            name:  timeValues.map((t, ind) => ind != timeValues.length-1 ? `${t.value}${t.type}` : '').join('') +
            `${timeValues.at(-1).value + i}${timeValues.at(-1).type}`,
            value: timeValues.map((t, ind) => ind != timeValues.length-1 ? `${t.value}${t.type}` : '').join('') +
            `${timeValues.at(-1).value + i}${timeValues.at(-1).type}`
        });
    }
    return interaction.respond(responseOptions);
}