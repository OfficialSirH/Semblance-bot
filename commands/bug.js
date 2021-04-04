const { MessageEmbed, MessageAttachment, Collection, Permissions } = require('discord.js'), Report = require('../models/Report.js'), 
    mongoose = require('mongoose'), { prefix, sirhGuildID, c2sGuildID } = require('../config.js'),
    { getPermissionLevel, randomColor } = require('../constants'), wait = require('util').promisify(setTimeout),
    cooldown = new Collection(),
    CHANNELS = {
        QUEUE: '798933535255298078',
        APPROVED: '798933965539901440'
    }

module.exports = {
    description: "Big epicc bug reporting feature exclusively for C2S server.",
    category: 'c2sServer',
    usage: {
        "help/<bugID>": ""
    },
    aliases: ['report', 'bugreport'],
    permissionRequired: 0,
    checkArgs: (args) => args.length > 0,
    CHANNELS: CHANNELS,
    correctReportList: (client, message, messageID) => correctReportList(client, message, messageID),
    Report: Report
}

module.exports.run = async (client, message, args, identifier, { permissionLevel, content }) => {
    if (message.guild.id != c2sGuildID) return;
    if ((identifier == 'report' || identifier == 'bug' || identifier == 'bugreport') && args[0] == 'help') return help(message, permissionLevel);
    else if (identifier == 'report' || identifier == 'bugreport') return report(message, content, client);
    else if (identifier == 'bug') return bug(client, message, permissionLevel, content, args);
}

async function help(message, permissionLevel) {
    let description = ['```diff',
        'REQUIREMENTS:',
        '+ Title',
            '\tThis is the title of the bug, just a quick description basically',
        '+ Actual Result',
            '\tWhat occurs in this bug that shouldn\'t be occuring normally?',
        '+ Expected Result',
            '\tWhat do you think or know should be happening in this situation instead of the actual result?',
        '+ Operating System',
            '\tWhat system are you playing the game on? For example: Windows 10, Android 9, Iphone 12',
        '+ Game Version',
            '\tWhat is the game\'s version that you\'re playing during the cause of this bug?(i.e. 8.06)',
        '+ FORMAT',
            `\t${prefix}report TITLE`,
            '\tACTUAL_RESULT',
            '\tEXPECTED_RESULT',
            '\tSYSTEM_INFO',
            '\tGAME_VERSION',
        '- OR',
            `\t${prefix}report TITLE | ACTUAL_RESULT | EXPECTED_RESULT | SYSTEM_INFO | GAME_VERSION`,
        
        '\nREPORT EXAMPLE:',
            `\t${prefix}report Bad Bug`,
            '\tIt does something bad',
            '\tIt shouldn\'t do something bad',
            '\tWindows 69',
            '\t4_20',
        
        '\nWHAT IF I HAVE THE SAME BUG OCCURING AS ANOTHER USER WHO HAS ALREADY REPORTED IT?',
        '+ FORMAT:',
            `\t${prefix}bug BUG_ID reproduce SYSTEM_INFO | GAME_VERSION`,
        '- OR',
            `\t${prefix}bug BUG_ID reproduce SYSTEM_INFO`,
            '\tGAME_VERSION',
        
        '\nREPRODUCE EXAMPLE:',
            `\t${prefix}bug 360 reproduce Android 420 | 4_69` 
    ];
    if (permissionLevel > 0) description = description.concat(['\nAPPROVING AND DENYING BUGS:',
        `+ 'approve' or 'deny'`,
        '+ reason(optional)',
        'EXAMPLE: s!bug 69 approve nice'
    ]);
    description.push('```');
    let embed = new MessageEmbed()
        .setTitle("Reporting Help")
        .setColor(randomColor)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(description.join('\n'))
        .setFooter("That's a feature, not a bug!");
    message.channel.send(embed);
}

async function report(message, content, client) {
    let difcontent = content.replace(/\|\|/g, '').split('|').filter(c => c.trim() != '');

    if (difcontent.length < 5) {
        content = content.split('\n').filter(c => c.trim() != '');
        if (content.length < 5) {

            let missingContent = () => {
                if (content.length > difcontent.length) for (let i = content.length; i < 5; i++) { content.push(`+ Need info for this line.`); return content.join('\n'); }
                if (difcontent.length > content.length) for (let i = difcontent.length; i < 5; i++) { difcontent.push(`+ Need info for this line.`); return difcontent.join('\n'); }
                for (let i = difcontent.length; i < 5; i++) difcontent.push(`+ Need info for this line.`); return difcontent.join('\n');
            }
            message.author.send([`You're missing some input for the report, remember that each subject is separated through new lines,`,
                `which can be done with SHIFT + ENTER on PC or pressing the enter key on mobile. Check out \`${prefix}report help\` for more details.\n`,
                `\`\`\`diff\n${missingContent()}\n\`\`\``].join(' '));
            return message.delete();
        }
    } else content = difcontent;
    if (content[0].length < 1 || content[1].length < 1 || content[2].length < 1 || content[3].length < 1 || content[4].length < 1) return message.reply("You missed some content in your report, please don't leave fields empty.").then(msg => setTimeout(() =>{ if(!msg.deleted) msg.delete() }, 10000));

    let userCooldown = cooldown.get(message.author.id);
    if (userCooldown && Date.now() - userCooldown < (1000 * 60 * 5) && !message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return message.reply(`You're on cooldown with this command, you can use the command again in ${(Date.now() - userCooldown - (1000 * 60 * 5)) / 1000 / 60} minutes.`);
    else if (!userCooldown || Date.now() - userCooldown > (1000 * 60 * 5)) cooldown.set(message.author.id, Date.now());

    let reportHandler = await Report.find({}), totalReports = reportHandler.map(r => r).length;
    const currentBugID = totalReports + 1;
    var embed = new MessageEmbed()
        .setAuthor(`${message.author.tag} (${message.author.id})\nBug ID: #${currentBugID}`, message.author.displayAvatarURL())
        .setColor("#9512E8")
        .setTitle(content[0])
        .addFields(
            { name: "Actual Result", value: content[1] },
            { name: "Expected Result", value: content[2] },
            { name: "Operating System", value: content[3] },
            { name: "Game Version", value: content[4] },
            { name: "Can Reproduce", value: "Currently no one else has reproduced this bug." }
        )
        .setFooter(`#${currentBugID}`)
        .setTimestamp(Date.now());
    let attachmentURL = "none";
    if (message.attachments.size > 0) {
        let attachment = new MessageAttachment(message.attachments.map(a => a)[0].proxyURL, "Image.png");
        client.guilds.cache.get(sirhGuildID).channels.cache.find(c => c.name == "image-storage").send(attachment)
            .then(msg => attachmentURL = msg.attachments.map(a => a)[0].proxyURL);
        let videoType = [".mov", ".mp4", ".mkv", ".webm"], imageType = [".png", ".jpg", ".jpeg", ".gif"],
            foundType = false;
        for (var type in videoType) {
            if (!foundType && attachmentURL.includes(type)) {
                embed.addField("Attachments", `[1. Video](${attachmentURL})\n`);
                foundType = true;
            }
        }
        if (!foundType) for (var type in imageType) {
            if (!foundType && attachmentURL.includes(type)) {
                embed.addField("Attachments", `[1. Image](${attachmentURL})\n`);
                foundType = true;
            }
        }
    }
    let reportURL;
    message.guild.channels.cache.get(CHANNELS.QUEUE).send(embed).then(async (msg) => { // <-- #bug-approval-queue channel in C2S
        let report = new Report({ User: message.author.id, bugID: currentBugID, messageID: msg.id, channelID: msg.channel.id });
        await report.save();
        reportURL = msg.url;
    });
    message.delete();
    message.channel.send(new MessageEmbed().setTitle(`Report Successfully Sent!`)
        .setURL(reportURL)
        .setAuthor(message.author.tag)
        .setColor(randomColor)
        .setDescription([`Your report's ID: ${currentBugID}`
            `Attaching an attachment: \`${prefix}bug ${currentBugID} attach (YouTube, Imgur, or Discord attachment link here if you don't have attachment)\`(NOTE: You *don't* need to place the parentheses around the link)`
            `**attach either an image or video(must be under 50 MB) with your attach command if the optional choices aren't available**`].join('\n'))
        .setFooter('Thank you for your considerable help towards Cell to Singularity, we appreciate it. :)'));
}

async function bug(client, message, permissionLevel, content, args) {
    let providedID = args[0].replace(/\D/g, ''), report;
    if (!providedID) return message.reply("The ID you specified is invalid").then(msg => { setTimeout(() =>{ if(!msg.deleted) msg.delete() }, 5000); message.delete() });
    report = await Report.findOne({ bugID: providedID });
    if (!report && report.length >= 17 && report.length <= 21) report = await Report.findOne({ messageID: providedID });
    if (!report) return message.reply("The ID you specified doesn't exist.").then(msg => { setTimeout(() =>{ if(!msg.deleted) msg.delete() }, 5000); message.delete() });


    if (args[1] == 'attach') addAttachment(client, message, report, message.attachments.map(a => a)[0] || args.slice(2)[0]);

    else if (args[1] == 'reproduce') addReproduce(message, report, args);

    else if (args[1] == 'deleterepro' || args[1] == 'reprodelete') deleteReproduce(message, report, args);

    else if (permissionLevel >= 1) {
        var channel = message.guild.channels.cache.get(CHANNELS.APPROVED); // <-- #approved-bugs channel in C2S
        if (args[1] == 'archive') archiveReport(client, message, report);
        else if (args[1] == 'approve') fixUpReports(client, message, channel, report, args.slice(2).join(' '), true);

        else if (args[1] == 'deny') fixUpReports(client, message, channel, report, args.slice(2).join(' '), false);

    } else if (args[1] == 'approve' || args[1] == 'deny') message.reply("You do not have permission to use this.").then(msg => setTimeout(() =>{ if(!msg.deleted) msg.delete() }, 5000));
    message.delete();
}

async function addAttachment(client, message, report, attachment = null) {
    if (getPermissionLevel(message.member) == 0 && report.User != message.author.id) return message.reply("You don't have permission to add attachments to other people's reports.");
    if (attachment == null) return message.reply("You didn't send any attachment nor a link");
    else if (typeof attachment == 'string') {
        attachmentFieldCorrection(client, message, report, attachment);
    } else {
        let attachmentURL = attachment.proxyURL;

        const storedMsg = await client.guilds.cache.get(sirhGuildID).channels.cache.get('794054989860700179').send(attachment); // <== Uses ID of #image-storage from SirH's server
        attachmentURL = storedMsg.attachments.map(a => a)[0].proxyURL;

        message.guild.channels.cache.get(report.channelID).messages.fetch(report.messageID)
            .then(msg => {
                let attachmentsField = msg.embeds[0].fields[5];
                if (!attachmentsField) {
                    msg.edit(msg.embeds[0].addField("Attachments", `1. [${attachment.name}](${attachmentURL})` ));
                } else if (attachmentsField.name == "Approval Message" || attachmentsField.name == "Denial Message") {
                    msg.embeds[0].fields.push(attachmentsField);
                    msg.edit(msg.embeds[0].spliceFields(5, 1, { name: "Attachments", value: `${attachmentsField.value}\n${attachmentsField.value.split('\n').length + 1}. [${attachment.name}](${attachmentURL})` }));
                } else {
                    msg.edit(msg.embeds[0].spliceFields(5, 1, { name: "Attachments", value: `${attachmentsField.value}\n${attachmentsField.value.split('\n').length + 1}. [${attachment.name}](${attachmentURL})` }));
                }
            });
    }
}

async function deleteReproduce(message, report, args) {
    message.guild.channels.cache.get(report.channelID).messages.fetch(report.messageID, { cache: false })
        .then(msg => {
            let reproduceField = msg.embeds[0].fields[4].value.split('\n');
            let itemIndex = reproduceField.findIndex(item => item.includes(args.join(' ')));
            if (itemIndex == -1) return message.reply("That reproduce item doesn't exist.").then(m => setTimeout(() =>{ if(!m.deleted) m.delete() }, 20000));
            else reproduceField.splice(itemIndex, 1);
            let editedResponse = msg.embeds[0].spliceFields(4, 1, { name: "Can Reproduce", value: (reproduceField || `no one has marked this report has reproducable.`) });
            msg.edit(editedResponse);

        }).catch(err => console.log(err));
}

async function addReproduce(message, report, specifications) {
    specifications = specifications.slice(2).join(' ').replace(/\|\|/g, '').split('|').filter(c => c.trim() != '');
    if (specifications.length < 2) specifications = specifications.join(' ').split('\n').filter(c => c.trim() != '');
    let sysInfo = specifications[0], gameVersion = specifications[1];

    if (!sysInfo) return message.reply("You forgot to provide system information and game version.").then(msg => setTimeout(() =>{ if(!msg.deleted) msg.delete() }, 5000));
    if (!gameVersion) return message.reply("You forgot to provide the game version.").then(msg => setTimeout(() =>{ if(!msg.deleted) msg.delete() }, 5000));

    message.guild.channels.cache.get(report.channelID).messages.fetch(report.messageID, { cache: false })
        .then(msg => {
            var reproduceField = msg.embeds[0].fields[4];
            if ((reproduceField.value.match(/:white_check_mark:/g) || []).length == 10) return message.reply("This report has reached its reproduce limit.");
            if (reproduceField.value.indexOf(message.author.tag) >= 0) return message.reply("You have already added your `reproduced` check on this report.");
            if (reproduceField.value.startsWith(":white_check_mark:")) var editedReproduce = msg.embeds[0].spliceFields(4, 1, { name: "Can Reproduce", value: `${reproduceField.value}\n:white_check_mark:${message.author.tag}|${sysInfo}|${gameVersion}` });
            else var editedReproduce = msg.embeds[0].spliceFields(4, 1, { name: "Can Reproduce", value: `:white_check_mark:${message.author.tag}|${sysInfo}|${gameVersion}` });
            msg.edit(editedReproduce);
        })
        .catch(err => err);
}

async function fixUpReports(client, message, channel, report, reason, approved) {
    if (!reason) reason = "unspecified";
    message.guild.channels.cache.get(CHANNELS.QUEUE).messages.fetch(report.messageID, { cache: false }) // <-- #bug-approval-queue channel from C2S
        .then(async msg => {
            let user = await client.users.fetch(report.User);
            if (approved) {
                let m = await channel.send(msg.embeds[0].setColor("#17DB4A").addField("Approval Message", reason));
                await Report.findOneAndUpdate({ messageID: report.messageID }, { $set: { messageID: m.id, channelID: m.channel.id } }, { new: true });
            }
            else {
                let m = await user.send(msg.embeds[0].setColor("#D72020").addField("Denial Message", reason)) // <-- Denied Reports
                await Report.findOneAndDelete({ messageID: report.messageID });
            }
            msg.delete();
        }).catch(err => console.log(`Approval/Denial had an issue due to:\n${err}`));
}

async function attachmentFieldCorrection(client, message, report, item) {
    let attachmentURL, creationFailed = false, youtubeLink = false, attachment;

    if (/https?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)\w{11}/.exec(item) != null) {
        attachmentURL = item;
        attachment = {
            name: "YouTube Link"
        }
    } else if (/https?:\/\/(?:i\.)?imgur\.com\/(?:gallery\/)?\w{5,12}/.exec(item) != null) {
        attachmentURL = item;
        attachment = {
            name: "Imgur Link"
        }
    } else try {
        attachment = new MessageAttachment(item);
        await client.guilds.cache.get(sirhGuildID).channels.cache.get('794054989860700179').send(attachment) // <== Uses ID of #image-storage from SirH's server
            .then((msg) => attachmentURL = msg.attachments.map(a => a)[0].proxyURL);

        let videoType = [".mov", ".mp4", ".mkv", ".webm"], imageType = [".png", ".jpg", ".jpeg", ".gif"],
            foundType = false;
        for (var type of videoType) {
            if (!foundType && attachmentURL.includes(type)) {
                attachment.setName(`Video${type}`);
                foundType = true;
            }
        }
        if (!foundType) for (var type of imageType) {
            if (!foundType && attachmentURL.includes(type)) {
                attachment.setName(`Image${type}`);
                foundType = true;
            }
        }
    } catch (err) {
        creationFailed = true;
    }

    if (creationFailed) return;

    message.guild.channels.cache.get(report.channelID).messages.fetch(report.messageID)
        .then(msg => {
            let attachmentsField = msg.embeds[0].fields[5];
            if (!attachmentsField) {
                msg.embeds[0].fields.push({ name: "Attachments", value: `1. [${attachment.name}](${attachmentURL})\n` });
                msg.edit(msg.embeds[0]);
            } else if (attachmentsField.name == "Approval Message" || attachmentsField.name == "Denial Message") {
                msg.embeds[0].fields.push(attachmentsField);
                msg.edit(msg.embeds[0].spliceFields(5, 1, { name: "Attachments", value: `1. [${attachment.name}](${attachmentURL})` }));
            } else {
                msg.edit(msg.embeds[0].spliceFields(5, 1, { name: "Attachments", value: `${attachmentsField.value}\n${attachmentsField.value.split('\n').length + 1}. [${attachment.name}](${attachmentURL})` }));
            }
        });

}

async function correctReportList(client, message, messageID) {
    let deletedReport = await Report.findOneAndDelete({ messageID: messageID });
    if (!deletedReport) return;
    let reportList = await Report.find({});
    reportList = Array.from(reportList.map(r => r.bugID).filter(item => item > deletedReport.bugID));
    await reportList.forEach(async (bugID) => {
        let report = await Report.findOneAndUpdate({ bugID: bugID }, { $set: { bugID: bugID - 1 } }, { new: true });
        //let user = await client.users.fetch(report.User); //Might remove as it's redundant and is unecessary to fetch
        try {
            message.guild.channels.cache.get(report.channelID).messages.fetch(report.messageID)
                .then(msg => {
                    let author = msg.embeds[0].author;
                    msg.edit(msg.embeds[0].setAuthor(`${author.name.slice(0, author.name.indexOf('\n'))}\nBug ID: #${bugID - 1}`, author.iconURL).setFooter(`#${bugID - 1}`))
                    //msg.edit(msg.embeds[0].setAuthor(`${user.tag} (${user.id})\nBug ID: #${bugID - 1}`, user.displayAvatarURL()).setFooter(`#${bugID - 1}`))
                });
        } catch(e) {
            console.error(e);
            throw new Error("Apparently there was an issue finding that message...");
        }
    });
    console.log(`All ${reportList.length} reports have successfully been reorganized!`);
}

async function archiveReport(client, message, report) {
    let msg = await message.guild.channels.cache.get(report.channelID).messages.fetch(report.messageID);
    let author = msg.embeds[0].author;
    try {
        msg.edit(msg.embeds[0].setAuthor(`${author.name.slice(0, author.name.indexOf('\n'))}\nArchived Report`, author.iconURL).setFooter(`Archived Report`));
        await Report.findOneAndDelete({ bugID: report.bugID });

        let reportList = await Report.find({});
        reportList = Array.from(reportList.map(r => r.bugID).filter(item => item > report.bugID));
        await reportList.forEach(async (bugID) => {
            message.guild.channels.cache.get(report.channelID).messages.fetch(report.messageID)
                .then(msg => {
                    let author = msg.embeds[0].author;
                    msg.edit(msg.embeds[0].setAuthor(`${author.name.slice(0, author.name.indexOf('\n'))}\nBug ID: #${bugID - 1}`, author.iconURL).setFooter(`#${bugID - 1}`));
                });
            await Report.findOneAndUpdate({ bugID: bugID }, { $set: { bugID: bugID - 1 } }, { new: true });
        });

        message.reply("Report successfully archived(This message will delete in 5 seconds)").then(msg => msg.delete({timeout: 5000}));
    }
    catch(e) { 
        console.error(e);
    }

}