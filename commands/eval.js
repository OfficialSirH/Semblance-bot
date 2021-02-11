const { MessageEmbed } = require('discord.js'), randomColor = require('../constants/colorRandomizer.js');

module.exports = {
    description: "Evaluate some code.",
    usage: {
        "<code ...>": "The code you want to run through the bot."
    },
    examples: {},
    aliases: [],
    permissionRequired: 7, // 0 All, 1 Helper, 2 JR.Mod, 3 Mod, 4 SR.Mod, 5 Exec, 6 Admin, 7 SirH#4297
    checkArgs: (args) => args.length >= 1
}

const constants = require("../constants")

module.exports.run = async (client, message, args, identifier, { permissionLevel, content }) => { // we get all the values so we can use them in the eval-command itself
    let embed = new MessageEmbed().setColor(randomColor()).addField("📥 Input", `\`\`\`js\n${content.substring(0, 1000)}\`\`\``).setFooter("Feed me code!");
    try {
        let evaled = eval(`try { (async () => { ${content} })() } catch (e) { throw new Error(e) }`);
        if (typeof evaled != "string") evaled = require("util").inspect(evaled);
        embed.addField("📤 Output", `\`\`\`js\n${evaled.substring(0, 1015)}\`\`\``).setTitle("✅ Evaluation Completed");
        message.channel.send(embed);
    } catch (e) {
        if (typeof e == "string") e = e.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
        embed.addField("📤 Output", `\`\`\`fix\n${e.substring(0, 1014)}\`\`\``).setTitle("❌ Evaluation Failed");
        message.channel.send(embed);
    }
}
