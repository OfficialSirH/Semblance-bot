import { MessageEmbed, CommandInteraction, Snowflake, User } from 'discord.js';
import { randomColor, getAvatar } from '@semblance/constants';
import { Semblance } from '../../structures';

module.exports = {
    permissionRequired: 0,
    run: async (client: Semblance, interaction: CommandInteraction) => {
        let user = interaction.options.getUser('user') ?
        await client.users.fetch(interaction.options.getUser('user').id) :
        interaction.member.user as User,
        author = interaction.member.user as User,
        embed = new MessageEmbed()
        .setTitle(`${user.username}'s Avatar`)
        .setAuthor(`${author.tag}`, author.displayAvatarURL())
        .setColor(randomColor)
        .setImage(getAvatar(user));
        return interaction.reply({ embeds: [embed] });
    }
}