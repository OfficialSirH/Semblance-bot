const { prefix } = require('@semblance/config').default,
    { parseArgs } = require('@semblance/constants');

module.exports = (client, message) => {
    const { commands, aliases } = client;
    if (message.content.toLowerCase().startsWith(prefix) || message.content.match(`^<@!?${client.user.id}> `)) {
        let content = message.content.split(" ")
        if (content[0].match(`^<@!?${client.user.id}>`)) content.shift(); else content = message.content.slice(prefix.length).split(" ")
        const identifier = content.shift().toLowerCase(), command = aliases[identifier] || identifier;
        content = content.join(" ")

        const commandFile = commands[command]
        if (commandFile && commandFile.category == 'dm') {
            const args = parseArgs(content);
            try {
                if (!commandFile.checkArgs(args, content)) return message.channel.send(`❌ Invalid arguments! Usage is \`${prefix}${command}${Object.keys(commandFile.usage).map(a => " " + a).join("")}\`, for additional help, see \`${prefix}help\`.`)
                commandFile.run(client, message, args, identifier, { content });
                client.increaseCommandCount();
            } catch (e) { }
        }
    }
}