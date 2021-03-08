const { MessageEmbed } = require('discord.js'),
    {randomColor} = require('../constants'),
    Afk = require('../models/Afk.js');

module.exports = {
    permissionRequired: 0
}

module.exports.run = async (client, interaction) => {
	let reason = (!!interaction.data.options) ? interaction.data.options[0].value : "Just because";
    let user = interaction.member.user;
    let afkHandler = await Afk.findOne({ userID: user.id });
	if (afkHandler == null) {
		afkHandler = new Afk({ userID: user.id, reason: reason });
		await afkHandler.save();
	} else afkHandler = await Afk.findOneAndUpdate({ userID: user.id }, { $set: { reason: reason } }, { new: true });
	
	let embed = new MessageEmbed()
		.setTitle("AFK")
		.setColor(randomColor)
		.setDescription(`You are now afk <@${user.id}> \n` +
            `Reason: ${reason}`);
    embed = embed.toJSON();
    return [{ embeds: [embed] }];
}