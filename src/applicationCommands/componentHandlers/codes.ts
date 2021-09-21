import { ButtonData } from "@semblance/lib/interfaces/Semblance";
import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js";
import { Information } from "../../models";
import config from '@semblance/config';
const { currentLogo } = config;

export const run = async (interaction: MessageComponentInteraction, { action, id }: ButtonData) => {
    const codeHandler = await Information.findOne({ infoType: 'codes' }), embed = interaction.message.embeds[0] as MessageEmbed;
    let component: MessageActionRow;
    if (action == 'expired') {
        embed.setDescription(codeHandler.expired);
        component = new MessageActionRow()
        .addComponents([new MessageButton()
            .setCustomId(JSON.stringify({
                command: 'codes',
                action: 'valid',
                id
            }))
            .setLabel('View Valid Codes')
            .setStyle('PRIMARY')  
        ]);
    } else if (action == 'valid') {
        embed.setDescription(codeHandler.info);
        component = new MessageActionRow()
        .addComponents([new MessageButton()
            .setCustomId(JSON.stringify({
                command: 'codes',
                action: 'expired',
                id
            }))
            .setLabel('View Expired Codes')
            .setStyle('PRIMARY')  
        ]);
    }
    embed.setThumbnail(currentLogo.name);
    await interaction.update({ embeds: [embed], components: [component] });
}