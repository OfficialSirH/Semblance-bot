import { ButtonData } from "@semblance/lib/interfaces/Semblance";
import { Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { randomColor, subcategoryList } from "../constants";
import { Semblance } from "../structures";
import config from '@semblance/config';
const { prefix, c2sGuildID, sirhID, adityaID } = config;

export const run = async (interaction: MessageComponentInteraction, { action, id }: ButtonData, { permissionLevel }) => {
    let components = [new MessageActionRow()];
    if (action != 'help') components[0].components = [new MessageButton()
    .setCustomID(JSON.stringify({
        command: 'help',
        action: 'help',
        id
    }))
    .setLabel('Back')
    .setEmoji('⬅️')
    .setStyle('SECONDARY'),
    new MessageButton()
            .setCustomID(JSON.stringify({
                command: 'help',
                action: 'close',
                id
            }))
            .setLabel('Close')
            .setEmoji('🚫')
            .setStyle('SECONDARY')
    ];
    else components[0].components.push(new MessageButton()
    .setCustomID(JSON.stringify({
        command: 'help',
        action: 'close',
        id
    }))
    .setLabel('Close')
    .setEmoji('🚫')
    .setStyle('SECONDARY'));

    // Main Help Page
    if (action == 'c2shelp') return c2shelp(interaction, components);
    if (action == 'calculator') return calchelp(interaction, components);
    if (action == 'mischelp') return mischelp(interaction, components, permissionLevel);
    if (action == 'bug') return bughelp(interaction, components);
    
    // Cell to Singularity Help Page
    if (action == 'metabits') return metabits(interaction, components);
    if (action == 'mesoguide') return mesoguide(interaction, components);
    
    // Calculator Help Page
    if (action == 'largenumbers') return largenumbers(interaction, components);
    if (action == 'metahelp') return metahelp(interaction, components);
    if (action == 'itemhelp') return itemhelp(interaction, components);
    
    // Misc Help Page
    if (action == 'ahelp') return ahelp(interaction, components);
    
    // Back and Close Actions
    if (action == 'help') return help(interaction, components);
    if (action == 'close') (interaction.message as Message).delete();
}

async function help(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const client = interaction.client as Semblance, user = interaction.user;
    const c2sServerCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'c2sServer').map(key => `**\`${prefix}${key}\`**`);
	components[0].components = [new MessageButton()
        .setCustomID(JSON.stringify({
            command: 'help',
            action: 'c2shelp',
            id: user.id
        }))
        .setLabel('Cell to Singularity Help')
        .setStyle('PRIMARY'),
        new MessageButton()
        .setCustomID(JSON.stringify({
            command: 'help',
            action: 'calculator',
            id: user.id
        }))
        .setLabel('Calculator Help')
        .setStyle('PRIMARY'),
        new MessageButton()
        .setCustomID(JSON.stringify({
            command: 'help',
            action: 'mischelp',
            id: user.id
        }))
        .setLabel('Miscellaneous Help')
        .setStyle('PRIMARY'),
        new MessageButton()
        .setCustomID(JSON.stringify({
            command: 'help',
            action: 'bug',
            id: user.id
        }))
        .setDisabled(Boolean(interaction.guild.id != c2sGuildID && ![sirhID, adityaID].includes(user.id)))
        .setEmoji('🐛')
        .setLabel('Bug Reporting Help')
        .setStyle('PRIMARY'),
        ...components[0].components
    ];
    let embed = new MessageEmbed()
		.setTitle("Semblance Command List")
		.setColor(randomColor)
		.setAuthor(user.tag, user.displayAvatarURL())
		.setThumbnail(client.user.displayAvatarURL())
		.addFields(
			{
				name: '**-> Cell to Singularity Server Commands**',
				value: c2sServerCommands.join(', '),
				inline: true
			},
			{ 
				name: "**-> Slash Commands**",
				value: 
					[
					"Semblance's Slash Commands can be listed by typing `/`, which if none are visible,",
					"that's likely due to Semblance not being authorized on the server and a admin will need to click",
					`[here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot+applications.commands) to authorize Semblance.`
					].join(' ')
			}
		)
		.setFooter(`Stay Cellular! If you really like the work I've done to Semblance, then check out ${prefix}patreon :D`);
    await interaction.update({ embeds: [embed], components });
}

async function ahelp(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const client = interaction.client as Semblance;
    const adminCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'admin').map(key => `**\`${prefix}${key}\`**`)
	let embed = new MessageEmbed()
		.setColor(randomColor)
		.setTitle("**-> Admin Commands**")
		.setThumbnail(client.user.displayAvatarURL())
		.setDescription(adminCommands.join(', '));
    await interaction.update({ embeds: [embed], components });
}

async function c2shelp(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const client = interaction.client as Semblance, user = interaction.user;
    const mainCommands = subcategoryList(client, 'game', 'main');
    const mesozoicCommands = subcategoryList(client, 'game', 'mesozoic');
    const otherCommands = subcategoryList(client, 'game', 'other');
    components[0].components = [new MessageButton()
        .setCustomID(JSON.stringify({
            command: 'help',
            action: 'metabits',
            id: user.id
        }))
        .setLabel('Metabits Guide')
        .setStyle('PRIMARY'),
        new MessageButton()
        .setCustomID(JSON.stringify({
            command: 'help',
            action: 'mesoguide',
            id: user.id
        }))
        .setLabel('Mesozoic Valley Guide')
        .setStyle('PRIMARY'),
        ...components[0].components
    ];
    let embed = new MessageEmbed()
        .setTitle("**-> Cell to Singularity Commands**")
        .setAuthor(user.tag, user.displayAvatarURL())
        .setColor(randomColor)
        .setThumbnail(client.user.displayAvatarURL())
        .addFields([
            { name: 'Main Simulation', value: mainCommands, inline: true },
            { name: 'Mesozoic Valley', value: mesozoicCommands, inline: true },
            { name: '\u200b', value: '\u200b' },
            { name: 'Other/Extras', value: otherCommands, inline: true }
        ])
        .setFooter("C2S for the win!");
    await interaction.update({ embeds: [embed], components });
}

async function itemhelp(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const client = interaction.client as Semblance, user = interaction.user;
    let embed = new MessageEmbed()
        .setTitle("Item Calculator Help")
        .setAuthor(user.tag, user.displayAvatarURL())
        .setColor(randomColor)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(`The item calculator's command is done by doing ${prefix}itemcalc <item name> <item level> <current lvl> or ${prefix}itemcalcrev <item name> <currency input> <current lvl>` +
            ", which any name that has more than one word has to include '-', for example: martian-factory.")
        .addFields(
            {
                name: 'itemcalc example',
                value: `${prefix}itemcalc dna 100 58, this example is taking "dna" to get the specific cost for dna, then "100" is used to specify what level you\'re trying to calculate, finally, "58" specifies the current level the item is at.`
            },
            {
                name: 'itemcalcrev example',
                value: `${prefix}itemcalcrev martian-factory 1E48 148, this example uses the martian-factory for calculating the item\'s specific cost, then "1E48" is fossil input for how many fossils you\'re "spending", finally, "148" is your current level of the item you specified.`
            }
        )
        .setFooter("Item Calculator goes brrrr...");
    await interaction.update({ embeds: [embed], components });
}

async function largenumbers(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const client = interaction.client as Semblance, user = interaction.user;
    let embed = new MessageEmbed()
        .setTitle('Large Numbers')
        .setColor(randomColor)
        .setThumbnail(client.user.displayAvatarURL())
        .setAuthor(user.tag, user.displayAvatarURL())
        .setDescription(["the way to use all of the names when using the calculator commands are:\n"+
            "M(Million), B(Billion)", 
            "T(Trillion), Qa(Quadrillion)", 
            "Qi(Quintrillion), Sx(Sextillion)", 
            "Sp(Septillion), Oc(Octillion)",
            "No(Nonillion), Dc(Decillion)", 
            "UDc(UnDecillion), DDc(DuoDecillion)",
            "tDc(TreDecillion), QaDc(QuattuorDecillion)",
            "QiDc(QuinDecillion), SxDc(SexDecillion)",
            "SpDc(SeptenDecillion), OcDc(OctoDecillion)",
            "NoDc(NovemDecillion), V(Vigintillion)"].join(',\n') +
            "\nAll these names are case insensitive, meaning you don't have to type them in the exact correct capilization for it to work;" +
            " In case someone uses the British format for these names, please note that these are in US format, so they aren't the exact same as yours and if you would like to know what the names are in US format" +
            ", click [here](http://www.thealmightyguru.com/Pointless/BigNumbers.html)")
        .setFooter('Large Numbers go brrrr...');
    await interaction.update({ embeds: [embed], components });
}

async function metahelp(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const client = interaction.client as Semblance, user = interaction.user;
    let embed = new MessageEmbed()
        .setTitle("Metabit Calculator Help")
        .setColor(randomColor)
        .setThumbnail(client.user.displayAvatarURL())
        .setAuthor(user.tag, user.displayAvatarURL())
        .setDescription("The Metabit Calculator supports Scientific Notation, which means you can type numbers like 1E25, as well as names for numbers like million all the way to vigintillion;" +
            ` Use ${prefix}largenumbers to get more info on large numbers.`)
        .addFields(
            {
                name: "metacalc",
                value: "This command requires two inputs: first entropy, then ideas, which this command will then add up the two inputs(accumulation) and process the amount of metabits that would produce."
            },
            {
                name: 'metacalcrev',
                value: 'This command does the reverse of "metacalc" and will take in an input of metabits and process the accumulation of entropy&ideas you would need to produce that many metabits.'
            },
            {
                name: 'metacalc example',
                value: `${prefix}metacalc 1E23 1.59E49, this example shows 1E23 entropy and 1.59E49 ideas being used for input.`
            },
            {
                name: 'metacalcrev example',
                value: `${prefix}metacalcrev 1E6, this example is using 1E6 (or 1 million) metabits as input.`
            }
        )
        .setFooter("Metabit Calculator goes brrr.");
    await interaction.update({ embeds: [embed], components });
}

async function mischelp(interaction: MessageComponentInteraction, components: MessageActionRow[], permissionLevel: number) {
    const client = interaction.client as Semblance, user = interaction.user;
    const serverCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'server').map(key => `**\`${prefix}${key}\`**`),
		funCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'fun').map(key => `**\`${prefix}${key}\`**`),
		utilityCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'utility').map(key => `**\`${prefix}${key}\`**`),
	semblanceCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'semblance').map(key => `**\`${prefix}${key}\`**`);
	components[0].components = [new MessageButton()
        .setCustomID(JSON.stringify({
           command: 'help',
           action: 'ahelp',
           id: user.id 
        }))
        .setDisabled(permissionLevel == 0)
        .setLabel('Admin Help')
        .setStyle('PRIMARY'),
        ...components[0].components
    ]
    let embed = new MessageEmbed()
		.setTitle("Miscellaneous Commands")
		.setThumbnail(client.user.displayAvatarURL())
		.setColor(randomColor)
		.setAuthor(user.tag, user.displayAvatarURL())
		.addFields(
			{
				name: '**-> Server Commands**',
				value: serverCommands.join(', '),
				inline: true
			},
			{
				name: '**-> Fun Commands**',
				value: funCommands.join(', '),
				inline: true
			},
			{ 
				name: '**-> Utility Commands**',
				value: utilityCommands.join(', '),
				inline: true
			},
			{
				name: '**=> Semblance-related Commands**',
				value: semblanceCommands.join(', '),
				inline: true
			}
		);
    await interaction.update({ embeds: [embed], components });
}

async function calchelp(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const client = interaction.client as Semblance, user = interaction.user,
    calculatorCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'calculator').map(key => `**\`${prefix}${key}\`**`);
    components[0].components = [new MessageButton()
        .setCustomID(JSON.stringify({
            command: 'help',
            action: 'largenumbers',
            id: user.id
        }))
        .setLabel('Large Numbers')
        .setStyle('PRIMARY'),
        new MessageButton()
        .setCustomID(JSON.stringify({
            command: 'help',
            action: 'metahelp',
            id: user.id
        }))
        .setLabel('Metabit Calculator')
        .setStyle('PRIMARY'),
        new MessageButton()
        .setCustomID(JSON.stringify({
            command: 'help',
            action: 'itemhelp',
            id: user.id
        }))
        .setLabel('Item Calculator')
        .setStyle('PRIMARY'),
        ...components[0].components
    ];
    let embed = new MessageEmbed()
    .setTitle('Calculator Help')
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(randomColor)
	.setAuthor(user.tag, user.displayAvatarURL())
    .setDescription(calculatorCommands.join(', '));
    await interaction.update({ embeds: [embed], components });
}

async function bughelp(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const client = interaction.client as Semblance, user = interaction.user;

    let embed = new MessageEmbed()
    .setTitle('Bug Reporting Help')
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(randomColor)
	.setAuthor(user.tag, user.displayAvatarURL())
    .setDescription(['```diff',
        'REQUIREMENTS:',
        '+ Title',
            '\tThis is the title of the bug, just a quick description basically',
        '+ Actual Result',
            '\tWhat occurs in this bug that shouldn\'t be occuring normally?',
        '+ Expected Result',
            '\tWhat do you think or know should be happening in this situation instead of the actual result?',
        '+ Operating System',
            '\tWhat system are you playing the game on? For example: Windows 10, Android 9, Iphone 12',
        '+ Game Version',
            '\tWhat is the game\'s version that you\'re playing during the cause of this bug?(i.e. 8.06)',
        '+ FORMAT',
            `\t${prefix}report TITLE`,
            '\tACTUAL_RESULT',
            '\tEXPECTED_RESULT',
            '\tSYSTEM_INFO',
            '\tGAME_VERSION',
        '- OR',
            `\t${prefix}report TITLE | ACTUAL_RESULT | EXPECTED_RESULT | SYSTEM_INFO | GAME_VERSION`,
        
        '\nREPORT EXAMPLE:',
            `\t${prefix}report Bad Bug`,
            '\tIt does something bad',
            '\tIt shouldn\'t do something bad',
            '\tWindows 69',
            '\t4_20',
        
        '\nWHAT IF I HAVE THE SAME BUG OCCURING AS ANOTHER USER WHO HAS ALREADY REPORTED IT?',
        '+ FORMAT:',
            `\t${prefix}bug BUG_ID reproduce SYSTEM_INFO | GAME_VERSION`,
        '- OR',
            `\t${prefix}bug BUG_ID reproduce SYSTEM_INFO`,
            '\tGAME_VERSION',
        
        '\nREPRODUCE EXAMPLE:',
            `\t${prefix}bug 360 reproduce Android 420 | 4_69`,
        '```'
    ].join('\n'));
    await interaction.update({ embeds: [embed], components });
}

async function metabits(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const client = interaction.client as Semblance, user = interaction.user;

    let embed = new MessageEmbed()
    .setTitle('Metabits Guide')
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(randomColor)
	.setAuthor(user.tag, user.displayAvatarURL())
    .setDescription([["Metabits are basically earned from the total accumulation of entropy and ideas(with a bit of an equation involved),",
    "which means you would want to increase your production rate for entropy and ideas to make Metabits faster, but how do I do that though?"].join(' '),

    ["**Main Simulation:**",
    "Unlock and buy generators that produce more to increase Metabit production"].join('\n'),
    
    ["**Mesozoic Valley:**",
    "- Each rank in the MV provides a **10%** boost to your production speed while each Prestige in the MV provides a **50%** boost!",
    "- You will unlock Neoaves and other generators when you progress in MV, which also would grant a buff in the speed of Metabit production."].join('\n'),
    
    ["**Metabits:**",
    "Wait... Metabits increase my production speed, which in turn increases my Metabit production?",
    "Yes, yes it does, but the production speed boost from Metabits are received after you collect your earned Metabits(i.e. rebooting your simulation)."].join('\n'),
    
    ["**Reality Engine:**",
    "There are upgrades in the Reality Engine that specifically boost your production speed, which you can total up to **2105%** if you got all of the upgrades, now that's a lot! :D"].join('\n'),
    
    "If you'd like to see the effects all of these have on overall production speed, use the slash command, `/metaspeedcalc`, to play around with the values!"].join('\n\n'));
    await interaction.update({ embeds: [embed], components });
}

async function mesoguide(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const client = interaction.client as Semblance, user = interaction.user;

    let embed = new MessageEmbed()
    .setTitle('Mesozoic Valley Guide')
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(randomColor)
	.setAuthor(user.tag, user.displayAvatarURL())
    .addFields([
        {
            name: '**Starting a new stage**',
            value: [`\`\`\`\nWhen starting a new stage get to your newest dinos as fast as possible completely ignoring all the dinos before the newest 3-4. Then only upgrade these few as far as you can afford in the first 10-15 min.`, 
                `After that focus on the missions to get geodes to upgrade your trait cards.`,
                `Buying other dinos is only recommended right before getting to the next stage to take the free mutagen from getting 25, 50, 100, 150, 250 and 500 of one dino. Don’t buy anything that doesn’t achieve one of these two things.\`\`\``].join(' '),
                inline: true
        },
        {
            name: '**Missions**',
            value: [`\`\`\`\nAlways try to do all the missions before calling the asteroid to get to the next stage.`,
            `Leaving one open might not be a big deal but getting all of them is recommended because the missing trait cards and mutagen will really hurt you in the long run.\`\`\``].join(' ')
        },
        { 
            name: '**Traits**',
            value: [`\`\`\`\nAlways upgrade the rare (silver) and epic (gold) traits because you keep them after you reset on stage 50. The normal traits should be upgraded depending on which level you are on. Only upgrade the newest 2-3 dinos to this level, because the efficiency drops significantly below that.`,
                [`(This next segment is not completely accurate yet, so only take it as a rough estimate)`,
                `Recommended trait level depending on stage:`].join('\n'),
                [`Stage 1-5: lvl 1-2`,
                `Stage 6-10: lvl 2-3`,
               `Stage 11-15: lvl 3-4`,
                `Stage 16-20: lvl 4-5`,
                `Stage 21-25: lvl 5-6`,
                `Stage 26-30: lvl 6-7`,
                `Stage 31-35: lvl 7-8`,
                `Stage 36-40: lvl 8-9`,
                `Stage 41-45: lvl 9-10`,
                `Stage 46-50: lvl 10-11`].join('\n'),
                `If you have lots of mutagen left, you can of course use that to speed up you progress by upgrading the traits further.\`\`\``
            ].join('\n\n'),
            inline: true
        },
        {
            name: '** The Shop**',
            value: [`\`\`\`\nThe shop is the third tab in the navigation menu. The Shop gives you options to buy geodes, trait cards and mutagen. When to buy what stuff is really important because buying too much wastes resources and buying too little wastes time.`,

            `Buy Geodes only on stage 50 before prestiging, because the content of the geodes scales with you stage so it is most effective to buy them on stage 50.`,
            
            `Buying traits is a good way of levelling up the new/lower-level cards on higher stages because the shop always gives you the newest cards that don’t have an upgrade available. Only buy trait cards if you have mutagen left over.`,
            
            `The mutagen part of the shop is not needed because completing all the missions should provide you with enough mutagen to get you through the entire mesozoic valley. Of course speeding up your progress with darwinium using these offers is possible.\`\`\``].join('\n\n')
        }
    ])
    .setFooter(`Thanks to Jojoseis#0001 for making this guide! :D`);
    await interaction.update({ embeds: [embed], components });
}
