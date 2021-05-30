import { MessageEmbed, TextChannel } from 'discord.js'; 
import { Votes, Game } from '@semblance/models';
import config from '@semblance/config';
import { randomColor } from '@semblance/constants';
import { request } from '@semblance/lib/interfaces/botsForDiscord';
import { Response } from 'express';
const { sirhGuildID } = config;

export const bfdVoteHandler = (req: request, res: Response) => {
	const { vote, client } = req;
	if (!client.readyAt) return;
	if (vote.type == 'test') return console.log("Test Vote Completed.");
	let channel = client.guilds.cache.get(sirhGuildID).channels.cache.find(c => c.name == 'semblance-votes') as TextChannel;
	client.users.fetch(vote.user, false).then(async (u) => {
		try {
			console.log(`${u.tag} just voted!`);
			let playerData = await Game.findOne({ player: vote.user });
			let earningsBoost = 3600 * 6;
			let description = `Thanks for voting for Semblance on botsfordiscord.com!! :D`;
			if (playerData)
				playerData = await Game.findOneAndUpdate({ player: vote.user }, { $set: { money: playerData.money + (playerData.idleProfit * earningsBoost) } }, { new: true });
			
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


		let existingUser = await Votes.findOne({ user: u.id });
		if (existingUser) {
			existingUser = await Votes.findOneAndUpdate({ user: u.id }, { $set: { voteCount: existingUser.voteCount + 1 } }, { new: true });
		} else {
			const voteHandler = new Votes({ user: u.id });
			await voteHandler.save();
		}
		
	});
};
