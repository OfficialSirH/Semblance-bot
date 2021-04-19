const { MessageEmbed } = require('discord.js'), 
    VoteModel = require('../../models/Votes.js').Votes, GameModel = require('../../models/Game.js').Game,
	{ sirhGuildID } = require('../../config.js'), {randomColor} = require('../../constants'),
    BOATS = require('boats.js'), Boats = new BOATS(JSON.parse(process.env.DBoatsAuth).Auth);

module.exports.run = (client) => {
    setInterval(function () {
        Boats.postStats(client.guilds.cache.size, client.user.id).then(() => {
            console.log('Successfully updated server count.');
        }).catch((err) => {
            console.error(err);
        });
    }, 1800000);

    module.exports.voteHandler = (req, res) => {
		const vote = req.vote;
        if (!!!client.readyAt) return;
		let channel = client.guilds.cache.get(sirhGuildID).channels.cache.find(c => c.name == 'semblance-votes');
		client.users.fetch(vote.user.id, { cache: false }).then(async (u) => {
			try {
				console.log(`${u.tag} just voted!`);
				let playerData = await GameModel.findOne({ player: vote.user.id });
				let earningsBoost = 3600 * 6;
				let description = `Thanks for voting for Semblance on discord.boats!! :D`;
				if (playerData)
					playerData = await GameModel.findOneAndUpdate({ player: vote.user.id }, { $set: { money: playerData.money + (playerData.idleProfit * earningsBoost) } }, { new: true });
				
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
						.setAuthor(`<@${vote.user.id}>`)
						.setColor(randomColor)
						.setDescription(`Thanks for voting for Semblance on discordbotlist.com!! :D`)
						.setFooter(`${vote.user.id} has voted.`);
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