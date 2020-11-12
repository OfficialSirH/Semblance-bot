const TwitchClient = require('twitch');
//const twitchCredentials = require("./twitchCredentials.json");
const twitchClient = TwitchClient.withClientCredentials(process.env.twitch_clientID, process.env.clientSecret);
const twitchName = "CellToSingularity";
let currentStream = null;

async function isStreamLive(userName, client) {
	try {
		const user = await twitchClient.helix.users.getUserByName(userName);
		if (!user) {
			return false;
		}
		let retrievedStream = await user.getStream();
		if (currentStream == null) currentStream = await user.getStream();
		try {
			if (retrievedStream.id !== currentStream.id && currentStream) {
				try {
					if (currentStream.type == "live") {
						let channel = client.channels.cache.get("730612621753057352");
						channel.send(`${twitchName} is live! Come and enjoy ${twitchName} stream **${currentStream.title}** https://twitch.tv/${twitchName}`);
					}
				} catch (err) {
					console.log(err);
					return;
				}
			} else {

			}
		} catch (err) {

		}
		currentStream = await user.getStream();
		return await user.getStream() !== null;
	} catch (err) {}
}

module.exports = (client) => {
	isStreamLive(twitchName, client);
}