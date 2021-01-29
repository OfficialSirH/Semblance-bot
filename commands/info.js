const { MessageEmbed } = require('discord.js'), msToTime = require('../constants/msToTime.js'), randomColor = require('../constants/colorRandomizer.js'),
    dpc = require('../package.json').dependencies, { singularity, entropy, metabit, mutagen, idea } = require('./emojis.js'), { sembID } = require('../config.js');
const botStartTime = Date.now();
module.exports = {
    description: "Get information about the epic bot, Semblance",
    usage: {
        "": ""
    },
    permissionRequired: 0,
    aliases: [],
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    let uptime = Date.now() - botStartTime;
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
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setColor(randomColor())
        .setThumbnail(client.user.avatarURL())
        .addFields(
            { name: `${singularity} Host`, value: '**OS:** [`Heroku`](https://heroku.com)` (web server)`\n'+
                                    `**Library:** \`${Object.keys(dpc).reduce((total, cur, ind, arr) => {return total += (cur === 'discord.js') ? cur+dpc[cur] : ''; }, ``)}\`\n`+
                                   `**Memory Usage:** \`${usage} MB (${Math.round(usage/512 * 10000)/100}%)\``, inline: true },
                                   
            
            { name: `${entropy} Stats`, value: `**Guilds:** \`${client.guilds.cache.size}\`\n`+
                                    `**Members:** \`${totalMembers}\`\n`+
                                    `**Shard Count:** \`${shardCount}\``, inline: true },
              
              { name: `${idea} Runtime`, value: `**Bot Response:** \`${responseTime} ms\`\n`+
                                      `**API Response:** \`${client.ws.ping} ms\`\n`+
                                      `**Uptime:** \`${duration}\``, inline: true }
        )
        .setFooter("The all powerful Semblance has spoken!");

    if (client.shard) embed.addField(`${metabit} This Shard (${message.guild.shardID})`, `**Guilds:** ${client.guilds.cache.size}\n` +
        `**Users:** ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)}`);

    embed.addField(`${mutagen} Links`, `- [Semblance Invite](https://discord.com/oauth2/authorize?client_id=${sembID}&permissions=8&scope=bot+applications.commands)\n` +
            `- [Semblance Support/Main](https://discord.gg/XFMaTn6taf)\n` +
            `- [Cell to Singularity](https://discord.gg/celltosingularity)`, true);
    message.channel.send(embed);
}
