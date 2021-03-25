const { MessageEmbed } = require('discord.js'), {randomColor} = require("../../constants"),
    VoteModel = require('../../models/Votes.js'), GameModel = require('../../models/Game.js'),
    { sirhGuildID } = require('../../config.js');//, BotList = require('botlist.space');
 


module.exports.run = (client) => {
    // const botListWebsocket = new BotList.WebSocket({ tokens: [JSON.parse(process.env.botListSpaceAuth).Auth], reconnect: true });
     
    // botListWebsocket.on('view', (event) => {
    //     console.log('Someone has viewed my bot: ' + event.bot.username);
    // });
     
    // botListWebsocket.on('invite', (event) => {
    //     console.log('Someone has invited my bot: ' + event.bot.username);
    // });
     
    module.exports.voteHandler = (req, res) => {
        const user = req.vote.user;
		if (!!!client.readyAt) return;
		let channel = client.guilds.cache.get(sirhGuildID).channels.cache.find(c => c.name == 'semblance-votes');
		if (req.vote.type == 'test') return console.log("Test Vote Completed.");
		client.users.fetch(user.id, { cache: false }).then(async (u) => {
			try {
				console.log(`${u.tag} just voted!`);
				let playerData = await GameModel.findOne({ player: user.id });
				let earningsBoost = 3600 * 6;
				let description = `Thanks for voting for Semblance on botlist.space!! :D`;
				if (playerData) {
					description += `\nAs a voting bonus, you have earned **6** hours of idle profit for Semblance's Idle Game!`;
					playerData = await GameModel.findOneAndUpdate({ player: user.id }, { $set: { money: playerData.money + (playerData.idleProfit * earningsBoost) } }, { new: true });
				}
				let embed = new MessageEmbed()
					.setAuthor(`${u.tag}`, u.displayAvatarURL())
					.setThumbnail(u.displayAvatarURL())
					.setColor(randomColor)
					.setDescription(description)
					.setFooter(`${u.tag} has voted.`);
				channel.send(embed);
	
			} catch (err) {
	
				console.log(err);
				try {
					let embed = new MessageEmbed()
						.setAuthor(`<@${user.id}>`)
						.setColor(randomColor)
						.setDescription(`Thanks for voting for Semblance on botlist.space!! :D`)
						.setFooter(`${user.id} has voted.`);
					channel.send(embed);
				} catch (err) {
					console.log(err);
				}
			}
	
	
			let existingUser = await VoteModel.findOne({ user: u.id });
			if (existingUser) {
				existingUser = await VoteModel.findOneAndUpdate({ user: u.id }, { $set: { voteCount: existingUser.voteCount + 1 } }, { new: true });
			} else {
				const voteHandler = new VoteModel({ user: u.id });
				await voteHandler.save();
			}
			
		});
    };
     
    botListWebsocket.on('close', (event) => {
        console.log('The gateway was closed', event);
    });
}