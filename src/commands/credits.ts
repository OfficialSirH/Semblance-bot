import { Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'; 
import { randomColor } from '@semblance/constants';
import { Semblance } from '@semblance/structures';

module.exports = {
	description: "Lists everyone that has helped with the project of Semblance, including myself(SirH).",
	category: 'semblance',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	const embed = new MessageEmbed()
		.setTitle("Credits")
		.setColor(randomColor)
		.addFields([
			{ name: "Developer", value: "SirH" },
			{ name: "Special Thanks and Organizer", value: "Aditya" },
			{ name: "Artist", value: ["**Semblance:** cabiie",
				"**Semblance Beta:** Lemon ([Lemon's Instagram page](https://www.instagram.com/creations_without_limtation/))",
				"**Semblance Revisioned:** StarLuckArt(preview soon:tm:) ([DeviantArt](https://www.deviantart.com/starluckart) and [Personal Site](https://bubblestheprotogen.wixsite.com/starluckart))"].join('\n')
			},
			{ name: "Silly dude who makes up funny ideas", value: "NerdGamer2848" },
			{ name: "Early Testers", value: "Aditya, Parrot, Diza, 0NrD, and Aure" },
			{ name: "Contributors", value: ["**Mesozoic Valley and Singularity Speedrun Guide:** Jojoseis",
				"**Image for Prestige List:** Hardik Chavada",
				"**Image for Nanobots:** SampeDrako",
				"**Image for Currency:** Off Pringles"].join('\n')
			}
		]);
	const component = new MessageActionRow()
	.addComponents([new MessageButton()
		.setCustomID(JSON.stringify({
			command: 'credits',
			action: 'thanks',
			id: message.author.id
		}))
		.setLabel('Special Thanks')
		.setStyle('PRIMARY'),
		new MessageButton()
		.setCustomID(JSON.stringify({
			command: 'credits',
			action: 'semblance',
			id: message.author.id
		}))
		.setLabel('Preview Semblance Art')
		.setStyle('PRIMARY'),
		new MessageButton()
		.setCustomID(JSON.stringify({
			command: 'credits',
			action: 'semblancebeta',
			id: message.author.id
		}))
		.setLabel('Preview Semblance Beta Art')
		.setStyle('PRIMARY'),
		new MessageButton()
		.setCustomID(JSON.stringify({
			command: 'credits',
			action: 'semblancerevisioned',
			id: message.author.id
		}))
		.setLabel('Preview Semblance Revisioned Art')
		.setStyle('PRIMARY')
	]);
	message.channel.send({ embeds: [embed], components: [component] });
}