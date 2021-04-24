const { MessageEmbed } = require('discord.js'),
    { randomColor } = require('../constants');

module.exports = {
    permissionRequired: 0,
    run: async (client, interaction) => {
        let user = (!!interaction.data.options) ? 
            (interaction.data.options[0].value == interaction.member.user.id) ?
            interaction.member.user :
            await client.users.fetch(interaction.data.options[0].value)
             : interaction.member.user,
            author = interaction.member.user,
            embed = new MessageEmbed()
                .setTitle(`${user.username}'s Avatar`)
                .setAuthor(`${author.tag}`, author.displayAvatarURL())
                .setColor(randomColor)
                .setImage(user.displayAvatarURL());
        return interaction.send(embed);
    }
}