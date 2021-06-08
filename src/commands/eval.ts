import { MessageEmbed, MessageAttachment, Message } from 'discord.js'; 
import { randomColor } from '@semblance/constants';
import * as constants from '@semblance/constants';
import fetch from 'node-fetch';
import * as fs from 'fs';
import config from '@semblance/config'; 
import { Semblance } from '../structures';
const { attachments } = config;

module.exports = {
    description: "Evaluate some code.",
    category: 'developer',
    usage: {
        "<code ...>": "The code you want to run through the bot."
    },
    examples: {},
    aliases: [],
    permissionRequired: 7,
    checkArgs: (args: string[]) => args.length >= 1
}

module.exports.run = async (client: Semblance, message: Message, args: string[], identifier: string, { permissionLevel, content }) => {
    let embed = new MessageEmbed().setColor(randomColor).addField("📥 Input", `\`\`\`js\n${content.substring(0, 1015)}\`\`\``).setFooter("Feed me code!");
    try {
        let evaled = eval(`(async () => { ${content} })().catch(e => { return "Error: " + e })`);
        Promise.resolve(evaled).then((result) => {
            evaled = result;
            if (typeof evaled != "string") evaled = require("util").inspect(evaled);
            let data = { embed: null, files: [] };
            if (evaled.length > 1015) {
                let evalOutputFile = new MessageAttachment(Buffer.from(`${evaled}`), 'evalOutput.js');
                data.files = [evalOutputFile];
                embed.addField("📤 Output", `Output is in file preview above`).setTitle("✅ Evaluation Completed");
            } else embed.addField("📤 Output", `\`\`\`js\n${evaled.substring(0, 1015)}\`\`\``).setTitle("✅ Evaluation Completed");
            data.embed = embed;
            message.channel.send(data);
        });
    } catch (e) {
        if (typeof e == "string") e = e.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
        embed.addField("📤 Output", `\`\`\`fix\n${e.toString().substring(0, 1014)}\`\`\``).setTitle("❌ Evaluation Failed");
        message.channel.send(embed);
    }
}
