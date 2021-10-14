import { MessageEmbed, MessageAttachment } from 'discord.js'; 
import { randomColor } from '@semblance/constants';
import type { Semblance } from '../structures';
import type { Message } from 'discord.js';
import type { Command } from '@semblance/lib/interfaces/Semblance';

export default {
    description: "Evaluate some code.",
    category: 'developer',
    usage: {
        "<code ...>": "The code you want to run through the bot."
    },
    aliases: [],
    permissionRequired: 7,
    checkArgs: (args) => args.length >= 1,
    run: (client, message, args, _identifier, { content }) => run(client, message, args, { content })
} as Command<'developer'>;

const run = async (client: Semblance, message: Message, args: string[], { content }) => {
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
            message.channel.send(data);
        });
    } catch (e) {
        if (typeof e == "string") e = e.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
        embed.addField("📤 Output", `\`\`\`fix\n${e.toString().substring(0, 1014)}\`\`\``).setTitle("❌ Evaluation Failed");
        message.channel.send({ embeds: [embed] });
    }
}
