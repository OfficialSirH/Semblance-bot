import { MessageEmbed, TextChannel } from 'discord.js'; 
import { Votes, Game } from '@semblance/models';
import config from '@semblance/config';
import { randomColor } from '@semblance/constants';
import { request } from '@semblance/lib/interfaces/discords';
import { Response, Request } from 'express';
import { Semblance } from '@semblance/src/structures';
const { sirhGuildId } = config;

export const bfdVoteHandler = (req: request | Request, res: Response, client: Semblance) => {
	const { vote } = req as request;
	if (vote.type == 'test') return console.log("Test Vote Completed.");
	let channel = client.guilds.cache.get(sirhGuildId).channels.cache.find(c => c.name == 'semblance-votes') as TextChannel;
	client.users.fetch(vote.user, { cache: false }).then(async (u) => {
		try {
			console.log(`${u.tag} just voted!`);
			let playerData = await Game.findOne({ player: vote.user });
			let earningsBoost = 3600 * 6;
			let description = `Thanks for voting for Semblance on discords.com!! :D`;
			if (playerData)
				playerData = await Game.findOneAndUpdate({ player: vote.user }, { $set: { money: playerData.money + (playerData.idleProfit * earningsBoost) } }, { new: true });
			
			let embed = new MessageEmbed()
				.setAuthor(`${u.tag}`, u.displayAvatarURL())
				.setThumbnail(u.displayAvatarURL())
				.setColor(randomColor)
				.setDescription(description)
				.setFooter(`${u.tag} has voted.`);
			channel.send({ embeds:[embed] });

		} catch (err) {

			console.log(err);
			try {
				let embed = new MessageEmbed()
					.setAuthor(`<@${vote.user}>`)
					.setColor(randomColor)
					.setDescription(`Thanks for voting for Semblance on botsfordiscord.com!! :D`)
					.setFooter(`${vote.user} has voted.`);
				channel.send({ embeds:[embed] });
			} catch (err) {
				console.log(err);
			}
		}


		let votingUser = await Votes.findOne({ user: u.id });
		if (!!votingUser) {
			votingUser = await Votes.findOneAndUpdate({ user: u.id }, { $set: { voteCount: votingUser.voteCount + 1 } }, { new: true });
		} else {
			votingUser = new Votes({ user: u.id });
			await votingUser.save();
		}
		Votes.emit('userVote', votingUser);
	});
};
