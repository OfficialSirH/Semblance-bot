const { Client, MessageAttachment, MessageEmbed } = require("discord.js"),
	VoteModel = require('../../models/Votes.js'), GameModel = require('../../models/Game.js');
var client = new Client();
const randomColor = require("../../constants/colorRandomizer.js");
const fs = require("fs");
//const topGGAuth = ("./topGGAuth.json");
const DBL = require("dblapi.js");
var dbl = new DBL(JSON.parse(process.env.topGGAuth).Auth, {
	webhookPort: process.env.PORT, webhookAuth: JSON.parse(process.env.topGGAuth).webAuth
}, client);
	dbl.webhook.on('ready', hook => {
		console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
		setInterval(() => {
			if (client.shard != null && client.shard) {
				dbl.postStats(client.guilds.cache.size, client.shard.ids, client.shard.count);
			} else {
				dbl.postStats(client.guilds.cache.size);
            }
		}, 1800000);
	});
	dbl.webhook.on('vote', vote => {
		var channel = NameToChannel('semblance-votes', client);
		if (vote.type == 'test') return console.log("Test Vote Completed.");
		var user = client.users.fetch(vote.user, { cache: false }).then(async (u) => {
			try {
				console.log(`${u.tag} just voted!`);
				var playerData = await GameModel.findOne({ player: vote.user });
				var earningsBoost = (vote.isWeekend) ? 3600 * 12 : 3600 * 6;
				var description = `Thanks for voting for Semblance on Top.gg!! :D`;
				if (playerData) {
					description += (vote.isWeekend) ? `\nAs a voting bonus *and* being the weekend, you have earned ***12*** hours of idle profit for Semblance's Idle Game!` : `\nAs a voting bonus, you have earned **6** hours of idle profit for Semblance's Idle Game!`;
					playerData = await GameModel.findOneAndUpdate({ player: vote.user }, { $set: { money: playerData.money + (playerData.idleProfit * earningsBoost) } }, { new: true });
				}
				var embed = new MessageEmbed()
					.setAuthor(`${u}`, u.displayAvatarURL())
					.setThumbnail(u.displayAvatarURL())
					.setColor(randomColor())
					.setDescription(description)
					.setFooter(`${u.tag} has voted.`);
				channel.send(embed);

			} catch (err) {

				console.log(err);
				try {
					var embed = new MessageEmbed()
						.setAuthor(`<@${vote.user}>`)
						.setColor(randomColor())
						.setDescription(`Thanks for voting for Semblance on Top.gg!! :D`)
						.setFooter(`${vote.user} has voted.`);
					channel.send(embed);
				} catch (err) {
					console.log(err);
				}
			}


			var existingUser = await VoteModel.findOne({ user: u.id });
			if (existingUser) {
				existingUser = await VoteModel.findOneAndUpdate({ user: u.id }, { $set: { voteCount: existingUser.voteCount + 1 } }, { new: true });
			} else {
				const voteHandler = new VoteModel({ user: u.id });
				await voteHandler.save();
			}
			
		});
			
	});


module.exports = {
	FixClient: (mainClient) => {
		client = mainClient;
    }
}

function NameToChannel(channel, theClient) {
	return theClient.channels.cache.find(c => c.name == channel);
}