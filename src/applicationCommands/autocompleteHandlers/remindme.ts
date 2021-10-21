import type { TimeLengthsString } from "@semblance/lib/interfaces/remindme";
import { clamp } from "@semblance/lib/utils/math";
import { timeInputRegex, timeInputAutocompleteAssistantRegex } from "@semblance/src/constants";
import type { ApplicationCommandOptionChoice, AutocompleteInteraction, CommandInteractionOptionResolver } from "discord.js";


export async function run(interaction: AutocompleteInteraction, options: CommandInteractionOptionResolver<AutocompleteInteraction>) {
    const focusedOption = options.getFocused() as string;
    if (parseInt(focusedOption) && parseInt(focusedOption).toString().length == focusedOption.length) {
        if (focusedOption.length > 2) return;
        const responseOptions = ['m', 'h', 'd', 'w', 'mo'].map(o => ({ name: `${focusedOption}${o}`, value: `${focusedOption}${o}` }));
        return interaction.respond(responseOptions);
    }

    const inputTypes = ['mo', 'w', 'd', 'h', 'm'];
    const timeAmount = timeInputRegex.exec(focusedOption);
    const { groups: { months = '0', weeks = '0', days = '0', hours = '0', minutes = '0' } } = timeAmount as TimeLengthsString;
    const timeValues = [months, weeks, days, hours, minutes].map((t, i) => { 
        return { type: inputTypes.at(i), value: parseInt(t) };
    }).filter(t => t.value > 0);
    if (timeValues.length === 0) return;

    let groups = { previousInputType: '', numInput: '' };
    if (timeInputAutocompleteAssistantRegex.exec(focusedOption)) 
        groups = timeInputAutocompleteAssistantRegex.exec(focusedOption).groups as { previousInputType: string, numInput: string };
    const { previousInputType, numInput } = groups;

    const finalTime = previousInputType && previousInputType != 'm' ? 
    { type: inputTypes.at(inputTypes.indexOf(previousInputType)+1), value: parseInt(numInput) } : timeValues.at(-1);
    
    const responseOptions: ApplicationCommandOptionChoice[] = [];
    for (let i = 0; i < clamp(99 - timeValues.at(-1).value, 0, 5) + 1; i++) {
        const values = timeValues.map((t, ind) => ind != timeValues.length-1 ? `${t.value}${t.type}` : '').join('') +
        `${previousInputType && previousInputType != 'm' ? focusedOption.slice(0, focusedOption.lastIndexOf(' ')) : ''}${finalTime.value + i}${finalTime.type}`;
        responseOptions.push({
            name:  values,
            value: values
        });
    }
    return interaction.respond(responseOptions);
}