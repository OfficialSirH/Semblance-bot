const { MessageEmbed } = require('discord.js'), {randomColor} = require("../../constants"),
    VoteModel = require('../../models/Votes.js'), GameModel = require('../../models/Game.js'),
    { sirhGuildID } = require('../../config.js'), BotList = require('botlist.space');
 


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
     
    botListWebsocket.on('upvote', async (event) => {
        if (!!!client.readyAt) return;
        const user = event.user;
		let channel = client.guilds.cache.get(sirhGuildID).channels.cache.find(c => c.name == 'semblance-votes');
			try {
				console.log(`${user.getTag()} just voted!`);
				let playerData = await GameModel.findOne({ player: user });
				let earningsBoost = 3600 * 6;
				let description = `Thanks for voting for Semblance on botlist.space!! :D`;
				
                if (playerData)
					playerData = await GameModel.findOneAndUpdate({ player: user }, { $set: { money: playerData.money + (playerData.idleProfit * earningsBoost) } }, { new: true });
				
                let embed = new MessageEmbed()
					.setAuthor(`${user.getTag()}`, user.getAvatarURL())
					.setThumbnail(user.getAvatarURL())
					.setColor(randomColor)
					.setDescription(description)
					.setFooter(`${user.getTag()} has voted.`);
				channel.send(embed);

			} catch (err) {

				console.log(err);
				try {
					let embed = new MessageEmbed()
						.setAuthor(`<@${user}>`)
						.setColor(randomColor)
						.setDescription(`Thanks for voting for Semblance on Top.gg!! :D`)
						.setFooter(`${user} has voted.`);
					channel.send(embed);
				} catch (err) {
					console.log(err);
				}
			}


			let existingUser = await VoteModel.findOne({ user: user.id });
			if (existingUser) {
				existingUser = await VoteModel.findOneAndUpdate({ user: user.id }, { $set: { voteCount: existingUser.voteCount + 1 } }, { new: true });
			} else {
				const voteHandler = new VoteModel({ user: user.id });
				await voteHandler.save();
			}
    });
     
    botListWebsocket.on('close', (event) => {
        console.log('The gateway was closed', event);
    });
}