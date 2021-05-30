import { MessageEmbed } from 'discord.js';
import { randomColor, getAvatar } from '@semblance/constants';
import { Semblance, Interaction } from '../structures';

module.exports = {
    permissionRequired: 0,
    run: async (client: Semblance, interaction: Interaction) => {
        let user = (!!interaction.data.options) ? 
            (interaction.data.options[0].value == interaction.member.user.id) ?
            interaction.member.user :
            await client.users.fetch(interaction.data.options[0].value as string)
             : interaction.member.user,
            author = interaction.member.user,
            embed = new MessageEmbed()
                .setTitle(`${user.username}'s Avatar`)
                .setAuthor(`${author.tag}`, author.displayAvatarURL())
                .setColor(randomColor)
                .setImage(getAvatar(user));
        return interaction.send(embed);
    }
}