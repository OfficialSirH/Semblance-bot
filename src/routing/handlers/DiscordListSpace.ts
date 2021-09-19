import { Votes, Game } from '@semblance/models';
import type { DLSRequest } from '@semblance/lib/interfaces/discordListSpace';
import type { Semblance } from '@semblance/src/structures';
import type { FastifyReply } from 'fastify';
import { VoteHandler } from '@semblance/src/structures/VoteHandler';

export class DiscordListSpace extends VoteHandler {
	constructor(client: Semblance) {
		super(client, 'discordlist.space');
	}

	async handle(request: DLSRequest, reply: FastifyReply): Promise<FastifyReply> {
		const vote = request.body;
		const user = await this.client.users.fetch(vote.user.id, { cache: false });
		
		console.log(`${user.tag} just voted!`);
		let playerData = await Game.findOne({ player: vote.user.id });

		if (playerData) playerData = await Game.findOneAndUpdate({ player: vote.user.id }, 
		{ $set: { money: playerData.money + (playerData.idleProfit * (3600 * 6)) } }, { new: true });
			
		this.sendVotedEmbed(user ?? vote.user.id, `Thanks for voting for Semblance on ${this.votingSite}!! :D`, { hasGame: !!playerData });

		let votingUser = await Votes.findOne({ user: user.id });
		if (!!votingUser) votingUser = await Votes.findOneAndUpdate({ user: user.id }, 
		{ $set: { voteCount: votingUser.voteCount + 1 } }, { new: true });
		else {
			votingUser = new Votes({ user: user.id });
			await votingUser.save();
		}
		Votes.emit('userVote', votingUser);

		return reply.code(200).send({ success: true });
	}
}