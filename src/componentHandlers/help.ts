import { ButtonData, Subcategory } from "@semblance/lib/interfaces/Semblance";
import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { randomColor, filterAction, subcategoryList } from "../constants";
import { Semblance } from "../structures";
import config from '@semblance/config';
const { prefix, currentLogo } = config;

export const run = async (interaction: MessageComponentInteraction, { action, id }: ButtonData, { permissionLevel }) => {
    let components = [new MessageActionRow()
        .addComponents([new MessageButton()
            .setCustomID(JSON.stringify({
                command: 'help',
                action: 'c2shelp',
                id
            }))
            .setLabel('Cell to Singularity Help')
            .setStyle('PRIMARY'),
            new MessageButton()
            .setCustomID(JSON.stringify({
                command: 'help',
                action: 'itemhelp',
                id
            }))
            .setLabel('Item Calculator Help')
            .setStyle('PRIMARY'),
            new MessageButton()
            .setCustomID(JSON.stringify({
                command: 'help',
                action: 'largenumbers',
                id
            }))
            .setLabel('Large Numbers Help')
            .setStyle('PRIMARY'),
            new MessageButton()
            .setCustomID(JSON.stringify({
                command: 'help',
                action: 'metahelp',
                id
            }))
            .setLabel('Metabit Calculator Help')
            .setStyle('PRIMARY'),
            new MessageButton()
            .setCustomID(JSON.stringify({
                command: 'help',
                action: 'mischelp',
                id
            }))
            .setLabel('Miscellaneous Help')
            .setStyle('PRIMARY')
        ]),new MessageActionRow()
        .addComponents([new MessageButton()
            .setCustomID(JSON.stringify({
                command: 'help',
                action: 'close',
                id
            }))
            .setLabel('Close')
            .setEmoji('🚫')
            .setStyle('SECONDARY')])
    ];

    if (action != 'help') components[1].components.unshift(new MessageButton()
        .setCustomID(JSON.stringify({
            command: 'help',
            action: 'help',
            id
        }))
        .setLabel('Back')
        .setEmoji('⬅️')
        .setStyle('SECONDARY')
    );
    if (permissionLevel > 0 && action != 'ahelp') components[1].components.unshift(new MessageButton()
	.setCustomID(JSON.stringify({
		command: 'help',
		action: 'ahelp',
		id
	}))
	.setLabel('Admin Help')
	.setStyle('PRIMARY'));

    filterAction(components, action);

    if (action == 'help') help(interaction, components);
    if (action == 'ahelp') ahelp(interaction, components);
    if (action == 'c2shelp') c2shelp(interaction, components);
    if (action == 'itemhelp') itemhelp(interaction, components);
    if (action == 'largenumbers')largenumbers(interaction, components);
    if (action == 'metahelp') metahelp(interaction, components);
    if (action == 'mischelp') mischelp(interaction, components);
    if (action == 'close') interaction.message.delete();
}

async function help(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const client = interaction.client as Semblance, user = interaction.user;
    const calculatorCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'calculator').map(key => `**\`${prefix}${key}\`**`),
		c2sServerCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'c2sServer').map(key => `**\`${prefix}${key}\`**`);
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
				name: '**-> Calculator Commands**',
				value: calculatorCommands.join(', '),
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
		.setFooter("Stay Cellular! If you really like the work I've done to Semblance, then check out 's!patreon' :D");
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
        .setDescription("The item calculator's command is done by doing s!itemcalc <item name> <item level> <current lvl> or s!itemcalcrev <item name> <currency input> <current lvl>" +
            ", which any name that has more than one word has to include '-', for example: martian-factory.")
        .addFields(
            {
                name: 'itemcalc example',
                value: 's!itemcalc dna 100 58, this example is taking "dna" to get the specific cost for dna, then "100" is used to specify what level you\'re trying to calculate, finally, "58" specifies the current level the item is at.'
            },
            {
                name: 'itemcalcrev example',
                value: 's!itemcalcrev martian-factory 1E48 148, this example uses the martian-factory for calculating the item\'s specific cost, then "1E48" is fossil input for how many fossils you\'re "spending", finally, "148" is your current level of the item you specified.'
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
                value: 's!metacalc 1E23 1.59E49, this example shows 1E23 entropy and 1.59E49 ideas being used for input.'
            },
            {
                name: 'metacalcrev example',
                value: 's!metacalcrev 1E6, this example is using 1E6 (or 1 million) metabits as input.'
            }
        )
        .setFooter("Metabit Calculator goes brrr.");
    await interaction.update({ embeds: [embed], components });
}

async function mischelp(interaction: MessageComponentInteraction, components: MessageActionRow[]) {
    const client = interaction.client as Semblance, user = interaction.user;
    const serverCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'server').map(key => `**\`${prefix}${key}\`**`),
		funCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'fun').map(key => `**\`${prefix}${key}\`**`),
		utilityCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'utility').map(key => `**\`${prefix}${key}\`**`),
		semblanceCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'semblance').map(key => `**\`${prefix}${key}\`**`);
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