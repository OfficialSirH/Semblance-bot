const { MessageEmbed } = require('discord.js'),
    { getAvatar, randomColor } = require('../constants');

module.exports = {
    permissionRequired: 0,
    run: async (client, interaction) => {
        let user = interaction.member.user,
            embed = new MessageEmbed()
                .setTitle("Credits")
                .setAuthor(user.tag, user.displayAvatarURL())
                .setColor(randomColor)
                .setDescription("Special Thanks to Aditya for motivating me from the very beginning to work on this bot. " +
                    "If it weren't for him, my bot wouldn't even be at this point right now; running on an actual server, " +
                    "built with a better Discord module than previously, and have this many features. He even convinced Hype " +
                    "to add my bot to Cell to Singularity, which I can't thank him enough for, cause I was too shy to ask Hype. " +
                    "Thanks again, Aditya, you've helped me a lot. :D")
                .addFields(
                    { name: "Developer", value: "SirH" },
                    { name: "Special Thanks and Organizer", value: "Aditya" },
                    { name: "Artist", value: "**Semblance Artist:** cabiie\n**Semblance Beta Artist:** Lemon ([Lemon's Instagram page](https://www.instagram.com/creations_without_limtation/))" },
                    { name: "Silly dude who makes up funny ideas", value: "NerdGamer" },
                    { name: "Early Testers", value: "Aditya, Parrot, Diza, 0NrD, and Aure" },
                );
        return interaction.send(embed);
    }
}