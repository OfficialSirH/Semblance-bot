import { MessageEmbed, TextChannel, User } from 'discord.js'; 
import { Votes, Game } from '@semblance/models';
import config from '@semblance/config';
import { randomColor } from '@semblance/constants';
import { request } from '@semblance/lib/interfaces/discordBoats';
import { Response, Request } from 'express';
import { Webhook } from '@semblance/src/structures';
const { sirhGuildId } = config;

export const dbVoteHandler = (req: request | Request, res: Response) => {
	const { vote } = req as request, { client } = Webhook;
	let channel = client.guilds.cache.get(sirhGuildId).channels.cache.find(c => c.name == 'semblance-votes') as TextChannel;
	client.users.fetch(vote.user.id, { cache: false }).then(async (u) => {
		try {
			console.log(`${u.tag} just voted!`);
			let playerData = await Game.findOne({ player: vote.user.id });
			let earningsBoost = 3600 * 6;
			let description = `Thanks for voting for Semblance on discord.boats!! :D`;
			if (playerData)
				playerData = await Game.findOneAndUpdate({ player: vote.user.id }, { $set: { money: playerData.money + (playerData.idleProfit * earningsBoost) } }, { new: true });
			
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
					.setAuthor(`<@${vote.user.id}>`)
					.setColor(randomColor)
					.setDescription(`Thanks for voting for Semblance on discordbotlist.com!! :D`)
					.setFooter(`${vote.user.id} has voted.`);
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