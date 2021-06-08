import { MessageEmbed, CommandInteraction } from 'discord.js';
import { randomColor, getAvatar } from '@semblance/constants';
import { Semblance } from '../structures';

module.exports = {
    permissionRequired: 0,
    run: async (client: Semblance, interaction: CommandInteraction) => {
        let user = (!!interaction.options) ? 
            (interaction.options[0].value == interaction.member.user.id) ?
            interaction.member.user :
            await client.users.fetch(interaction.options[0].value as string)
             : interaction.member.user,
            author = interaction.member.user,
            embed = new MessageEmbed()
                .setTitle(`${user.username}'s Avatar`)
                .setAuthor(`${author.tag}`, author.displayAvatarURL())
                .setColor(randomColor)
                .setImage(getAvatar(user));
        return interaction.reply(embed);
    }
}