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
    let embed = new MessageEmbed().setColor(randomColor()).addField("📥 Input", `\`\`\`js\n${content.substring(0, 1015)}\`\`\``).setFooter("Feed me code!");
    try {
        let evaled = eval(`(async () => { ${content} })().catch(e => { return "Error: " + e })`);
        Promise.resolve(evaled).then((result) => {
            evaled = result;
            if (typeof evaled != "string") evaled = require("util").inspect(evaled);
            if (evaled.length > 1015) {
                let splittedOutput = [];
                for (let i = 0; (i * 2039) < evaled.length; i++) {
                    splittedOutput.push(`\`\`\`js\n${evaled.substring((i * 2039),2039 + (i * 2039))}\`\`\``);
                }
                splittedOutput = splittedOutput.reduce((acc, cur, ind, arr) => { 
                    return [...acc, {
                        "title": `📤 Output (${ind+1}/${arr.length})`,
                        "description": cur,
                        "color": randomColor()
                    }];
                },[]);
                splittedOutput = splittedOutput.slice(0, 10);
                let reachedEnd = false;
                splittedOutput.reduce((acc, cur, ind, arr) =>{
                    if (acc >= 6000 && !reachedEnd) {
                        splittedOutput[ind-1].description = `${cur.description.substring(0, (6000 - (acc - cur.description.length))-3)}\`\`\``;
                        splittedOutput = splittedOutput.slice(0, ind-1);
                        reachedEnd = true;
                    }
                    return acc + (cur.description == null ? cur.fields[0].value.length : cur.description.length);
                },0);
                message.channel.createWebhook("Semblance", {
                    avatar: client.user.displayAvatarURL(),
                    reason: "Temporary webhook to send large eval output"
                }).then(async web => {
                    await web.send({embeds: splittedOutput});
                    web.delete("Large eval output finished sending");
                })
            } else
            embed.addField("📤 Output", `\`\`\`js\n${evaled.substring(0, 1015)}\`\`\``).setTitle("✅ Evaluation Completed");
            message.channel.send(embed);
        });
    } catch (e) {
        if (typeof e == "string") e = e.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
        embed.addField("📤 Output", `\`\`\`fix\n${e.toString().substring(0, 1014)}\`\`\``).setTitle("❌ Evaluation Failed");
        message.channel.send(embed);
    }
}
    /*let embed = new MessageEmbed().setColor(randomColor()).addField("📥 Input", `\`\`\`js\n${content.substring(0, 1000)}\`\`\``).setFooter("Feed me code!");
    try {
        let evaled = eval(`(async () => { ${content} })().catch(e => { return "Error: " + e })`);
        Promise.resolve(evaled).then((result) => {
            evaled = result;
            if (typeof evaled != "string") evaled = require("util").inspect(evaled);
            embed.addField("📤 Output", `\`\`\`js\n${evaled.substring(0, 1015)}\`\`\``).setTitle("✅ Evaluation Completed");
            message.channel.send(embed);
        });
    } catch (e) {
        if (typeof e == "string") e = e.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
        embed.addField("📤 Output", `\`\`\`fix\n${e.toString().substring(0, 1014)}\`\`\``).setTitle("❌ Evaluation Failed");
        message.channel.send(embed);
    }*/
