const { MessageEmbed } = require('discord.js'), {randomColor} = require('../../constants'),
    fetch = require('node-fetch'), DiscordBL = require('../../structures/discordblapi.js'),
    VoteModel = require('../../models/Votes.js'), GameModel = require('../../models/Game.js'),
	{ sirhGuildID } = require('../../config.js');
/* /discordblwebhook */
module.exports = (client) => {
    const discordbl = new DiscordBL(JSON.parse(process.env.discordBotListAuth).Auth, {
		webhookPort: (Number(process.env.PORT)+2).toString(), webhookAuth: JSON.parse(process.env.discordBotListAuth).webAuth
	}, client);

    discordbl.webhook.on('ready', hook => {
        console.log(`botsfordiscord.com Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
    });

    discordbl.webhook.on('posted', () => { 
        console.log(`successfully posted stats to botsfordiscord.com`);
    });

    discordbl.webhook.on('vote', async vote => {
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
    });

    /*const baseURL = 'https://discordbotlist.com/api/v1';

    setInterval(() => {
        const data = { guilds: client.guilds.cache.size };
        const r = await (await fetch(baseURL + '/bots/' + client.user.id + '/stats', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JSON.parse(process.env.botsForDiscordAuth).Auth
            },
            body: JSON.stringify(data)
        })).json();
        console.log(`discordbotlist.com Stat Post Succeeded: ${r.success}`);
    }, 1800000);*/
}