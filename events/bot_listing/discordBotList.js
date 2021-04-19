const { MessageEmbed } = require('discord.js'), {DblSDK} = require('../../structures'),
    VoteModel = require('../../models/Votes.js').Votes, GameModel = require('../../models/Game.js').Game,
	{ sirhGuildID } = require('../../config.js'), {randomColor} = require('../../constants');
/* /discordblwebhook */
module.exports.run = (client) => {
    const dbl = new DblSDK.Api(JSON.parse(process.env.discordBotListAuth).Auth);

	setInterval(() => {
		if (client.shard != null && client.shard)
			dbl.postStats({
				users: client.guilds.cache.reduce((acc, cur, ind) => acc += cur.memberCount, 0),
				guilds: client.guilds.cache.size,
				shard_id: client.shard.ids[0]
			});
		else 
			dbl.postStats({
				users: client.guilds.cache.reduce((acc, cur, ind) => acc += cur.memberCount, 0),
				guilds: client.guilds.cache.size
			});
	}, 1800000);


    module.exports.voteHandler = (req, res) => {
		const vote = req.vote;
        if (!!!client.readyAt) return;
		let channel = client.guilds.cache.get(sirhGuildID).channels.cache.find(c => c.name == 'semblance-votes');
		client.users.fetch(vote.id, { cache: false }).then(async (u) => {
			try {
				console.log(`${u.tag} just voted!`);
				let playerData = await GameModel.findOne({ player: vote.id });
				let earningsBoost = 3600 * 6;
				let description = `Thanks for voting for Semblance on discordbotlist.com!! :D`;
				if (playerData)
					playerData = await GameModel.findOneAndUpdate({ player: vote.id }, { $set: { money: playerData.money + (playerData.idleProfit * earningsBoost) } }, { new: true });
				
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
						.setAuthor(`<@${vote.id}>`)
						.setColor(randomColor)
						.setDescription(`Thanks for voting for Semblance on discordbotlist.com!! :D`)
						.setFooter(`${vote.id} has voted.`);
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
}