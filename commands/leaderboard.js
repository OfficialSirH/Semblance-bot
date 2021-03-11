const { MessageEmbed } = require('discord.js'),
	VoteModel = require('../models/Votes.js'),
	{ insertionSort, randomColor } = require('../constants'),
	{ Information } = require('./edit.js');

module.exports = {
	description: "Get a list of the top voters of the month.",
	category: 'semblance',
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
			.setColor(randomColor)
			.setDescription(`${leaderboardList}`)
			.setFooter("Vote for Semblance on Top.gg\n(Updates every minute)");
		message.channel.send(embed);
	} catch (error) { console.log(error); return message.reply("Something seemed to have not worked, unfortunately. oopsy"); }
}

let leaderboardList = 'There is currently no votes for this month.';

async function updateLeaderboard(client) {
	let users = {}, mappedUsers = await VoteModel.find({}), cacheList = await Information.findOne({ infoType: 'cacheList' });
	await mappedUsers.forEach(async (user, ind) => users[user.user] = user.voteCount);
	let list = [];
	for (const [key, value] of Object.entries(users)) {
		let user = (!!client.users.cache.get(key)) ? client.users.cache.get(key) : null;
		if (!user) {
			let newList = [...cacheList.list, key];
			await Information.findOneAndUpdate({ infoType: 'cacheList' }, { $set: { list: newList } }, { new: true });
			user = await client.users.fetch(key);
        }
		list.push([user.tag, value]);
	}
	list = insertionSort(list).filter((item, ind) => ind < 20).reduce((total, cur, ind) => total += `${ind + 1}. ${cur[0]} - ${cur[1]} vote(s)\n`, '');
	if (!list || list.length == 0) leaderboardList = 'There is currently no voters for this month.';
	else leaderboardList = list;
	setTimeout(() => module.exports.updateLeaderboard(client), 60000);
}

function NameToChannel(channel, theClient) {
	return theClient.channels.cache.find(c => c.name == channel);
}
