import { MessageEmbed, TextChannel } from 'discord.js'; 
import { randomColor } from '@semblance/constants';
import { Votes, Game } from '@semblance/models';
import config from '@semblance/config';
import { DLSRequest } from '@semblance/lib/interfaces/discordListSpace';
import { Semblance } from '@semblance/src/structures';
import { FastifyReply } from 'fastify';
const { sirhGuildId } = config;

export const dlsVoteHandler = (req: DLSRequest, res: FastifyReply, client: Semblance) => {
	const vote = req.body, user = vote.user;
	let channel = client.guilds.cache.get(sirhGuildId).channels.cache.find(c => c.name == 'semblance-votes') as TextChannel;
	if (vote.type == 'test') return console.log("Test Vote Completed.");
	client.users.fetch(user.id, { cache: false }).then(async (u) => {
		try {
			console.log(`${u.tag} just voted!`);
			let playerData = await Game.findOne({ player: user.id });
			let earningsBoost = 3600 * 6;
			let description = `Thanks for voting for Semblance on discordlist.space!! :D`;
			if (playerData) {
				description += `\nAs a voting bonus, you have earned **6** hours of idle profit for Semblance's Idle Game!`;
				playerData = await Game.findOneAndUpdate({ player: user.id }, { $set: { money: playerData.money + (playerData.idleProfit * earningsBoost) } }, { new: true });
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
					.setAuthor(`<@${user.id}>`)
					.setColor(randomColor)
					.setDescription(`Thanks for voting for Semblance on discordlist.space!! :D`)
					.setFooter(`${user.id} has voted.`);
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