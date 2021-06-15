import { MessageEmbed, Snowflake, TextChannel } from 'discord.js'; 
import { Votes, Game } from '@semblance/models';
import config from '@semblance/config';
import { randomColor } from '@semblance/constants';
import { Response } from 'express';
import { request } from '@semblance/lib/interfaces/topGG';
const { sirhGuildID } = config;

export const tpggVoteHandler = (req: request, res: Response) => {
	const { vote, client } = req;
	if (!client.readyAt) return;
	let channel = client.guilds.cache.get(sirhGuildID).channels.cache.find(c => c.name == 'semblance-votes') as TextChannel;
	if (vote.type == 'test') return console.log("Test Vote Completed.");
	client.users.fetch(vote.user as Snowflake, { cache: false }).then(async (u) => {
		try {
			console.log(`${u.tag} just voted!`);
			let playerData = await Game.findOne({ player: vote.user as Snowflake });
			let earningsBoost = (vote.isWeekend) ? 3600 * 12 : 3600 * 6;
			let description = `Thanks for voting for Semblance on Top.gg!! :D`;
			if (playerData) {
				description += (vote.isWeekend) ? `\nAs a voting bonus *and* being the weekend, you have earned ***12*** hours of idle profit for Semblance's Idle Game!` : `\nAs a voting bonus, you have earned **6** hours of idle profit for Semblance's Idle Game!`;
				playerData = await Game.findOneAndUpdate({ player: vote.user as Snowflake }, { $set: { money: playerData.money + (playerData.idleProfit * earningsBoost) } }, { new: true });
			}
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
					.setDescription(`Thanks for voting for Semblance on Top.gg!! :D`)
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