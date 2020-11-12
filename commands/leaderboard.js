const { MessageEmbed } = require('discord.js'),
	randomColor = require('../constants/colorRandomizer.js'),
	VoteModel = require('../models/Votes.js');

module.exports = {
	description: "Get a list of the top voters of the week.",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0,
	updateLeaderboard: (client) => updateLeaderboard(client)
}

module.exports.run = async (client, message, args) => {
	let channel = NameToChannel("semblance-votes", client);try {
		
		let embed = new MessageEmbed()
			.setTitle("Voting Leaderboard")
			.setThumbnail(client.user.displayAvatarURL())
			.setColor(randomColor())
			.setDescription(`${leaderboardList}`)
			.setFooter("Vote for Semblance on Top.gg");
		message.channel.send(embed);
	} catch (error) { console.log(error); message.reply("Something seemed to have not worked, unfortunately. oopsy"); return; }
}

let leaderboardList = 'There is currently no votes for this month.';

async function updateLeaderboard(client) {
	let users = {};
	let mappedUsers = await VoteModel.find({});
	await mappedUsers.forEach(async (user, ind) => users[user.user] = user.voteCount);
	let list = [];
	for (const [key, value] of Object.entries(users)) {
		let user = await client.users.fetch(key, { cache: false });
		list.push([user.tag, value]);
	}
	list = await list.sort((a, b) => b[1] - a[1]).filter((item, ind) => ind < 20).reduce((total, cur, ind) => total += `${ind + 1}. ${cur[0]} - ${cur[1]} vote(s)\n`, '');
	if (!list || list.length == 0) leaderboardList = 'There is currently no voters for this month.';
	else leaderboardList = list;
	setTimeout(module.exports.updateLeaderboard(client), 60000);
}

function NameToChannel(channel, theClient) {
	return theClient.channels.cache.find(c => c.name == channel);
}
