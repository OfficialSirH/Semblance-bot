const { MessageEmbed } = require('discord.js'), {randomColor, msToTime} = require('../constants'),
    dpc = require('../package.json').dependencies, { singularity, entropy, metabit, mutagen, idea } = require('../config').default;
    
module.exports = {
    description: "Get information about the epic bot, Semblance",
    category: 'semblance',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    aliases: [],
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    let uptime = Date.now() - client.readyTimestamp;
    let duration = msToTime(uptime);
    let responseTime = Date.now() - message.createdTimestamp;
    let totalMembers = client.guilds.cache.reduce((total, cur, ind) => total += cur.memberCount, 0);
    let usage = Math.round(process.memoryUsage().heapUsed / Math.pow(1024, 2) * 100) / 100;
      if (message.client.shard) {
      guilds = await message.client.shard.broadcastEval('this.guilds.cache.size').then(res => res.reduce((prev, val) => prev + val, 0))
      users = await message.client.shard.broadcastEval('this.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)').then(res => res.reduce((prev, val) => prev + val, 0))
      shardCount = message.client.shard.count
    } else {
      guilds = message.client.guilds.size
      users = message.client.users.size
      shardCount = 0
    }
    let embed = new MessageEmbed()
        .setTitle(`Bot Information - ${client.user.tag}`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(randomColor)
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
            { name: `${singularity} Host`, value: [`**OS:** \`Ubuntu ${require('os').release()}\``,
                                    `**Library:** \`discord.js${dpc['discord.js']}\``,
                                   `**Memory Usage:** \`${usage} MB (${Math.round(usage/512 * 10000)/100}%)\``].join('\n'), inline: true },
                                   
            
            { name: `${entropy} Stats`, value: [`**Guilds:** \`${client.guilds.cache.size}\``,
                                    `**Members:** \`${totalMembers}\``,
                                    `**Shard Count:** \`${shardCount}\``].join('\n'), inline: true },
              
              { name: `${idea} Runtime`, value: [`**Bot Response:** \`${responseTime} ms\``,
                                      `**API Response:** \`${client.ws.ping} ms\``,
                                      `**Uptime:** \`${duration}\``].join('\n'), inline: true }
        )
        .setFooter("The all powerful Semblance has spoken!");

    if (client.shard) embed.addField(`${metabit} This Shard (${message.guild.shardID})`, `**Guilds:** ${client.guilds.cache.size}\n` +
        `**Users:** ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)}`);

    embed.addField(`${mutagen} Links`, [`- [Semblance Invite](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot+applications.commands)`,
            `- [Semblance Support/Main](https://discord.gg/XFMaTn6taf)`,
            `- [Cell to Singularity](https://discord.gg/celltosingularity)`].join('\n'), true);
    message.channel.send(embed);
}
