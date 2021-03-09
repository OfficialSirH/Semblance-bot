const { MessageEmbed } = require('discord.js'), {randomColor} = require('../../constants'),
    { sirhGuildID } = require('../../config'), BotList = require('botlist.space');
 


module.exports = (client) => {
    const botListClient = new BotList.Client({ id: client.user.id, botToken: JSON.parse(process.env.botListSpaceAuth).Auth }),
        botListWebsocket = new BotList.WebSocket({ tokens: [JSON.parse(process.env.botListSpaceAuth).Auth], reconnect: true });
    
    setInterval(() => 
    botListClient.postServerCount(client.guilds.cache.size).then((bot) => console.log("Server count post to botlist.space was successful")).catch((err) => console.error(err))
    , 1800000);

    botListWebsocket.on('connected', () => {
        console.log('Successfully connected to the botlist.space gateway');
    });
     
    botListWebsocket.on('view', (event) => {
        console.log('Someone has viewed my bot: ' + event.bot.username);
    });
     
    botListWebsocket.on('invite', (event) => {
        console.log('Someone has invited my bot: ' + event.bot.username);
    });
     
    botListWebsocket.on('upvote', (event) => {
        let embed = new MessageEmbed()
            .setAuthor(event.user.getTag(), event.user.getAvatarURL())
            .setColor(randomColor)
            .setThumbnail(event.user.getAvatarURL())
            .setDescription(`Thanks for voting for Semblance on botlist.space, ${event.user.getTag()}! :D`);
        client.guilds.cache.get(sirhGuildID).channels.cache.find(c => c.name == 'semblance-votes').send(embed);
        console.log(event.user.username + 'has upvoted my bot: ' + event.bot.username);
    });
     
    botListWebsocket.on('close', (event) => {
        console.log('The gateway was closed', event);
    });
}