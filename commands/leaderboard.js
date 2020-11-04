const { MessageEmbed } = require('discord.js'),
	randomColor = require('../constants/colorRandomizer.js'),
	VoteModel = require('../models/Votes.js');

module.exports = {
	description: "Get a list of the top voters of the week.",
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
	var channel = NameToChannel("semblance-votes", client);try {
		var users = {};
		var mappedUsers = await VoteModel.find({});
		await mappedUsers.forEach(async (user, ind) => users[user.user] = user.voteCount);
		var list = [];
		for (const [key, value] of Object.entries(users)) {
			var user = await client.users.fetch(key, {cache: false});
			list.push([user.tag, value]);
		}
		list = list.sort((a, b) => b[1] - a[1]).filter((item, ind) => ind < 20).reduce((total, cur, ind) => total += `${ind + 1}. ${cur[0]} - ${cur[1]} vote(s)\n`, '');
		if (!list || list.length == 0) list = 'There is currently no voters for this month.';
		var embed = new MessageEmbed()
			.setTitle("Voting Leaderboard")
			.setThumbnail(client.user.displayAvatarURL())
			.setColor(randomColor())
			.setDescription(`${list}`)
			.setFooter("Vote for Semblance on Top.gg");
		message.channel.send(embed);
	} catch (error) { console.log(error); message.reply("Something seemed to have not worked, unfortunately. oopsy"); return; }
}

function NameToChannel(channel, theClient) {
	return theClient.channels.cache.find(c => c.name == channel);
}
