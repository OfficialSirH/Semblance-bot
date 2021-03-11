const { MessageEmbed } = require('discord.js'), {randomColor} = require('../../constants'),
    fetch = require('node-fetch'), BFD = require('../../structures/bfdapi.js'),
    VoteModel = require('../../models/Votes.js'), GameModel = require('../../models/Game.js'),
	{ sirhGuildID } = require('../../config.js');
/* /bfdwebhook */
module.exports = (client) => {
    const bfd = new BFD(JSON.parse(process.env.botsForDiscordAuth).Auth, {
		webhookPort: process.env.PORT, webhookAuth: JSON.parse(process.env.botsForDiscordAuth).webAuth
	}, client);

    bfd.webhook.on('ready', hook => {
        console.log(`botsfordiscord.com Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
    });

    bfd.webhook.on('posted', () => { 
        console.log(`successfully posted stats to botsfordiscord.com`);
    });

    bfd.webhook.on('vote', vote => {
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
    });

    /*const baseURL = 'https://botsfordiscord.com/api';

    setInterval(() => {
        const data = { server_count: client.guilds.cache.size };
        const r = await (await fetch(baseURL + '/bot/' + client.user.id, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(process.env.botsForDiscordAuth).Auth
            },
            body: JSON.stringify(data)
        })).json();
        console.log(`botsfordiscord.com: ${r.message}`);
    }, 1800000);*/
}