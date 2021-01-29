module.exports = {
    permissionRequired: 0
}

module.exports.run = async (client, interaction) => {
    if (!interaction.data.options[0]) return [{ content: "Ask any question and Semblance will answer." }];
    let randomizedChoice = Math.ceil(Math.random() * 20);
    if (randomizedChoice == 1) return [{ content: 'It is certain' }];
    if (randomizedChoice == 2) return [{ content: 'It is decidely so.' }];
    if (randomizedChoice == 3) return [{ content: 'Without a doubt' }];
    if (randomizedChoice == 4) return [{ content: 'Yes - definitely.' }];
    if (randomizedChoice == 5) return [{ content: 'You may rely on it.' }];
    if (randomizedChoice == 6) return [{ content: 'As I see it, yes.' }];
    if (randomizedChoice == 7) return [{ content: 'Most likely.' }];
    if (randomizedChoice == 8) return [{ content: 'Outlook good.' }];
    if (randomizedChoice == 9) return [{ content: 'Yes.' }];
    if (randomizedChoice == 10) return [{ content: 'Signs point to yes.' }];
    if (randomizedChoice == 11) return [{ content: 'Reply hazy, try again.' }];
    if (randomizedChoice == 12) return [{ content: 'Ask again later.' }];
    if (randomizedChoice == 13) return [{ content: 'Better not tell you now.' }];
    if (randomizedChoice == 14) return [{ content: 'Cannot predict now.' }];
    if (randomizedChoice == 15) return [{ content: 'Concentrate and ask again.' }];
    if (randomizedChoice == 16) return [{ content: 'Don\'t count on it.' }];
    if (randomizedChoice == 17) return [{ content: 'My reply is no.' }];
    if (randomizedChoice == 18) return [{ content: 'My sources say no.' }];
    if (randomizedChoice == 19) return [{ content: 'Outlook not so good.' }];
    if (randomizedChoice == 20) return [{ content: 'Very doubtful.' }];
}