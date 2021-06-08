import { MessageEmbed, CommandInteraction } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Semblance } from '../structures';

module.exports = {
    permissionRequired: 0,
    run: async (client: Semblance, interaction: CommandInteraction) => {
        let user = interaction.member.user,
            embed = new MessageEmbed()
            .setTitle("Credits")
            .setColor(randomColor)
            .setAuthor(user.tag, user.displayAvatarURL())
            .setDescription("Special Thanks to Aditya for motivating me from the very beginning to work on this bot. " +
                "If it weren't for him, my bot wouldn't even be at this point right now; running on an actual server, " +
                "built with a better Discord module than previously, and have this many features. He even convinced Hype " +
                "to add my bot to Cell to Singularity, which I can't thank him enough for, cause I was too shy to ask Hype. " +
                "Thanks again, Aditya, you've helped me a lot. :D")
            .addFields(
                { name: "Developer", value: "SirH" },
                { name: "Special Thanks and Organizer", value: "Aditya" },
                { name: "Artist", value: ["**Semblance:** cabiie",
                    "**Semblance Beta:** Lemon ([Lemon's Instagram page](https://www.instagram.com/creations_without_limtation/))",
                    "**Semblance Revisioned Art:** StarLuckArt(preview soon:tm:) ([DeviantArt](https://www.deviantart.com/starluckart) and [Personal Site](https://bubblestheprotogen.wixsite.com/starluckart))"] 
                },
                { name: "Silly dude who makes up funny ideas", value: "NerdGamer2848" },
                { name: "Early Testers", value: "Aditya, Parrot, Diza, 0NrD, and Aure" },
                { name: "Contributors", value: ["**Mesozoic Valley Guide:** Jojoseis",
                    "**Image for Prestige List:** Hardik Chavada",
                    "**Image for Nanobots:** SampeDrako",
                    "**Image for Currency:** Off Pringles"]
                }
            );
        return interaction.reply(embed);
    }
}