module.exports = {
    description: "See magical stuff",
    category: 'fun',
    usage: {
        "": ""
    },
    permissionRequired: 0,
    checkArgs: (args) => args.length >= 0
}

module.exports.run = async (client, message, args) => {
    if (args.length == 0) return message.reply("Ask any question and Semblance will answer.");
    let randomizedChoice = Math.ceil(Math.random() * 20);
    if (randomizedChoice == 1) return message.reply('It is certain');
    if (randomizedChoice == 2) return message.reply('It is decidely so.');
    if (randomizedChoice == 3) return message.reply('Without a doubt');
    if (randomizedChoice == 4) return message.reply('Yes - definitely.');
    if (randomizedChoice == 5) return message.reply('You may rely on it.');
    if (randomizedChoice == 6) return message.reply('As I see it, yes.');
    if (randomizedChoice == 7) return message.reply('Most likely.');
    if (randomizedChoice == 8) return message.reply('Outlook good.');
    if (randomizedChoice == 9) return message.reply('Yes.');
    if (randomizedChoice == 10) return message.reply('Signs point to yes.');
    if (randomizedChoice == 11) return message.reply('Reply hazy, try again.');
    if (randomizedChoice == 12) return message.reply('Ask again later.');
    if (randomizedChoice == 13) return message.reply('Better not tell you now.');
    if (randomizedChoice == 14) return message.reply('Cannot predict now.');
    if (randomizedChoice == 15) return message.reply('Concentrate and ask again.');
    if (randomizedChoice == 16) return message.reply('Don\'t count on it.');
    if (randomizedChoice == 17) return message.reply('My reply is no.');
    if (randomizedChoice == 18) return message.reply('My sources say no.');
    if (randomizedChoice == 19) return message.reply('Outlook not so good.');
    if (randomizedChoice == 20) return message.reply('Very doubtful.');
}