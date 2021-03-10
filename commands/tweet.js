const Twitter = require("twitter"), twClient = new Twitter(JSON.parse(process.env.twitter));

module.exports = {
	description: "Get the most recent tweet from any twitter user.",
	category: 'developer',
	usage: {
		"<twitter name>": "input the name of a user from twitter."
	},
	permissionRequired: 7,
	checkArgs: (args) => args.length >= 1
}

module.exports.run = (client, message, args) => {
	let screen_name = args[0];
	if (!screen_name) {
		screen_name = "ComputerLunch";
	}
	twClient.get('statuses/user_timeline', {
		screen_name,
		exclude_replies: false,
		count: 1
	}, async (error, tweets, response) => {
		if (error) {
			message.reply("Sorry, either your input was invalid or the back-end went haywire.");
			return console.log(error);
		}
		let tweet = tweets[0];
		try {
				if(tweet) {
					setTimeout(() => {message.channel.send(`Here's **${screen_name}'s** most recent Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}`); }, 1000);
				} else {
					message.reply("Sorry, either your input was invalid or the back-end went haywire.");
				}
		} catch (error) {
			message.reply("Sorry, either your input was invalid or the back-end went haywire.");
		}
	});
}