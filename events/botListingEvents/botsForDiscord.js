const { MessageEmbed } = require('discord.js'), BfdSDK = require('../../structures/@bots-for-discord/sdk/dist'),
    VoteModel = require('../../models/Votes.js'), GameModel = require('../../models/Game.js'),
	{ sirhGuildID } = require('../../config.js'), {randomColor} = require('../../constants');
/* /bfdwebhook */
module.exports.run = (client) => {
    const bfd = new BfdSDK.Api(JSON.parse(process.env.botsForDiscordAuth).Auth);

	setInterval(() => {
		bfd.postStats(client.guilds.cache.size);
	}, 1800000);

    module.exports.voteHandler = (req, res) => {
		const vote = req.vote;
        if (!!!client.readyAt) return;
        if (vote.type == 'test') return console.log("Test Vote Completed.");
		let channel = client.guilds.cache.get(sirhGuildID).channels.cache.find(c => c.name == 'semblance-votes');
		client.users.fetch(vote.user, { cache: false }).then(async (u) => {
			try {
				console.log(`${u.tag} just voted!`);
				let playerData = await GameModel.findOne({ player: vote.user });
				let earningsBoost = 3600 * 6;
				let description = `Thanks for voting for Semblance on botsfordiscord.com!! :D`;
				if (playerData)
					playerData = await GameModel.findOneAndUpdate({ player: vote.user }, { $set: { money: playerData.money + (playerData.idleProfit * earningsBoost) } }, { new: true });
				
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
						.setAuthor(`<@${vote.user}>`)
						.setColor(randomColor)
						.setDescription(`Thanks for voting for Semblance on botsfordiscord.com!! :D`)
						.setFooter(`${vote.user} has voted.`);
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