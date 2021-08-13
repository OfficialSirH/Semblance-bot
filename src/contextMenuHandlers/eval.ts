import { ContextMenuHandlerOptions } from '@semblance/lib/interfaces/Semblance'
import { ContextMenuInteraction, Message, MessageAttachment, MessageEmbed } from 'discord.js'
import { randomColor } from '../constants';
import fetch from 'node-fetch';


export const run = async (interaction: ContextMenuInteraction, { options, permissionLevel }: ContextMenuHandlerOptions) => {
    if (permissionLevel < 7) return interaction.reply({ content: `You do not have permission to use this command.`, ephemeral: true });
    const message = options.getMessage('message', true) as Message;
    let content: string;
    
    if (message.content.length == 0) content = await fetch(message.attachments.first().url).then(r => r.text());
    else content = (message.content.indexOf('```js') == 0) ? message.content.substring(3, message.content.length - 3) : message.content;

    let embed = new MessageEmbed().setColor(randomColor).addField("📥 Input", `\`\`\`js\n${content.substring(0, 1015)}\`\`\``).setFooter("Feed me code!");
    try {
        let evaled = eval(`(async () => { ${content} })().catch(e => { return "Error: " + e })`);
        Promise.resolve(evaled).then((result) => {
            evaled = result;
            if (typeof evaled != "string") evaled = require("util").inspect(evaled);
            let data = { embeds: null, files: [] };
            if (evaled.length > 1015) {
                let evalOutputFile = new MessageAttachment(Buffer.from(`${evaled}`), 'evalOutput.js');
                data.files = [evalOutputFile];
                embed.addField("📤 Output", `Output is in file preview above`).setTitle("✅ Evaluation Completed");
            } else embed.addField("📤 Output", `\`\`\`js\n${evaled.substring(0, 1015)}\`\`\``).setTitle("✅ Evaluation Completed");
            data.embeds = [embed];
            interaction.reply(data);
        });
    } catch (e) {
        if (typeof e == "string") e = e.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
        embed.addField("📤 Output", `\`\`\`fix\n${e.toString().substring(0, 1014)}\`\`\``).setTitle("❌ Evaluation Failed");
        interaction.reply({ embeds: [embed] });
    }
}