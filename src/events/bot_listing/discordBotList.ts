import { MessageEmbed, TextChannel } from 'discord.js';
import { Votes, Game } from '@semblance/models';
import config from '@semblance/config';
import { randomColor } from '@semblance/constants';
import { request } from '@semblance/lib/interfaces/discordBotList';
import { Response, Request } from 'express';
import { Semblance } from '@semblance/src/structures';
const { sirhGuildId } = config;

export const dblVoteHandler = (req: request | Request, res: Response, client: Semblance) => {
	const { vote } = req as request;
	let channel = client.guilds.cache.get(sirhGuildId).channels.cache.find(c => c.name == 'semblance-votes') as TextChannel;
	client.users.fetch(vote.id, { cache: false }).then(async (u) => {
		try {
			console.log(`${u.tag} just voted!`);
			let playerData = await Game.findOne({ player: vote.id });
			let earningsBoost = 3600 * 6;
			let description = `Thanks for voting for Semblance on discordbotlist.com!! :D`;
			if (playerData)
				playerData = await Game.findOneAndUpdate({ player: vote.id }, { $set: { money: playerData.money + (playerData.idleProfit * earningsBoost) } }, { new: true });
			
			let embed = new MessageEmbed()
				.setAuthor(`${u.tag}`, u.displayAvatarURL())
				.setThumbnail(u.displayAvatarURL())
				.setColor(randomColor)
				.setDescription(description)
				.setFooter(`${u.tag} has voted.`);
			channel.send({ embeds: [embed] });

		} catch (err) {

			console.log(err);
			try {
				let embed = new MessageEmbed()
					.setAuthor(`<@${vote.id}>`)
					.setColor(randomColor)
					.setDescription(`Thanks for voting for Semblance on discordbotlist.com!! :D`)
					.setFooter(`${vote.id} has voted.`);
				channel.send({ embeds: [embed] });
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