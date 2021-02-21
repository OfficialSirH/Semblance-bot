const { MessageEmbed, MessageAttachment, Collection } = require('discord.js'), randomColor = require('../constants/colorRandomizer.js'),
    Report = require('../models/Report.js'), mongoose = require('mongoose'), { prefix, sirhGuildID, c2sID } = require('../config.js'),
    { getPermissionLevel } = require('../constants/index.js'), wait = require('util').promisify(setTimeout),
    cooldown = new Collection(), reportChannelList = ["798933535255298078", "798933965539901440"], // <-- change IDs to the 3 bug report channels in C2S
    CHANNELS = {
        QUEUE: '798933535255298078',
        APPROVED: '798933965539901440'
    }

module.exports = {
    description: "Big epicc bug reporting feature exclusively for C2S server.",
    usage: {
        "help/report/<bugID>": ""
    },
    aliases: ['report', 'bugreport'],
    permissionRequired: 0,
    checkArgs: (args) => args.length > 0,
    reportChannelList: reportChannelList,
    CHANNELS: CHANNELS,
    correctReportList: (client, message, messageID) => correctReportList(client, message, messageID),
    Report: Report
}

module.exports.run = async (client, message, args, identifier, { permissionLevel, content }) => {
    if (message.guild.id != c2sID) return;
    if ((identifier == 'report' || identifier == 'bug' || identifier == 'bugreport') && args[0] == 'help') return help(message, permissionLevel);
    else if (identifier == 'report' || identifier == 'bugreport') return report(message, content, client);
    else if (identifier == 'bug') return bug(client, message, permissionLevel, content, args);
}

async function help(message, permissionLevel) {
    let description = [`**Reporting a bug!**`,
        `To report a bug, you would use \`${prefix}report\` then type out the 5 requirements for a report, which all 5 can be separated with new lines or |.`,
        `The 5 requirements are(in this order):`,
        `**Title** - A title for the bug, just something simple`,
        `**"Actual Result"** - What actually happens in the situation`,
        `**"Expected Result"** - What you expect the game to do in the situation`,
        `**"Operating System"** - The type of system/device you use(i.e. Windows 10, Android 7, Iphone 300 and whatever "the best innovated Iphone we've ever made(again)" - Apple)`,
        `**"Game Version"** - What version of C2S you're playing(i.e. 7_00)\n`,
        `You can also use \`${prefix}bug <bugID/messageID> reproduce <system info and game version>\`, which for system info and game version you can separate them with new lines or |.`];
    if (permissionLevel > 0) description = description.concat([`\n**Are you an epicc dev(i.e. ComputerLunch Team)?? Then here's some commands for you specifically for approving or denying people's reports!**`,
        `You can approve/deny a person's report with \`${prefix}bug <bugID or messageID> <"approve" or "deny"> <optional: reason>\``]);
    let embed = new MessageEmbed()
        .setTitle("Reporting Help")
        .setColor(randomColor())
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(description.join('\n'))
        .setFooter("That's a feature, not a bug!");
    message.channel.send(embed);
}

async function report(message, content, client) {
    let difcontent = content.replace(/\|\|/g, '').split('|');

    if (difcontent.length < 5) {
        content = content.split('\n');
        if (content.length < 5) {

            let missingContent = () => {
                if (content.length > difcontent.length) for (let i = content.length; i < 5; i++) content.push(`+ Need info for this line.`); return content.join('\n');
                if (difcontent.length > content.length) for (let i = difcontent.length; i < 5; i++) difcontent.push(`+ Need info for this line.`); return difcontent.join('\n');
                for (let i = difcontent.length; i < 5; i++) difcontent.push(`+ Need info for this line.`); return difcontent.join('\n');
            }
            message.author.send([`You're missing some input for the report, remember that each subject is separated through new lines,`,
                `which can be done with SHIFT + ENTER on PC or pressing the enter key on mobile. Check out \`${prefix}report help\` for more details.\n`,
                `\`\`\`diff\n${missingContent()}\n\`\`\``].join(' '));
            return message.delete();
        }
    } else content = difcontent;
    if (content[0].length < 1 || content[1].length < 1 || content[2].length < 1 || content[3].length < 1 || content[4].length < 1) return message.reply("You missed some content in your report, please don't leave fields empty.").then(msg => msg.delete({ timeout: 10000 }));

    let userCooldown = cooldown.get(message.author.id);
    if (userCooldown && Date.now() - userCooldown < (1000 * 60 * 5) && !message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(`You're on cooldown with this command, you can use the command again in ${(Date.now() - userCooldown - (1000 * 60 * 5)) / 1000 / 60} minutes.`);
    else if (!userCooldown || Date.now() - userCooldown > (1000 * 60 * 5)) cooldown.set(message.author.id, Date.now());

    let reportHandler = await Report.find({}), totalReports = reportHandler.map(r => r).length;
    var embed = new MessageEmbed()
        .setAuthor(`${message.author.tag} (${message.author.id})\nBug ID: #${totalReports + 1}`, message.author.displayAvatarURL())
        .setColor("#9512E8")
        .setTitle(content[0])
        .addFields(
            { name: "Actual Result", value: content[1] },
            { name: "Expected Result", value: content[2] },
            { name: "Operating System", value: content[3] },
            { name: "Game Version", value: content[4] },
            { name: "Can Reproduce", value: "Currently no one else has reproduced this bug." }
        )
        .setFooter(`#${totalReports + 1}`)
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
    message.guild.channels.cache.get(CHANNELS.QUEUE).send(embed).then(async (msg) => { // <-- #bug-approval-queue channel in C2S
        let report = new Report({ User: message.author.id, bugID: totalReports + 1, messageID: msg.id, channelID: msg.channel.id });
        await report.save();
    });
    message.delete();
}

async function bug(client, message, permissionLevel, content, args) {
    let report = await Report.findOne({ bugID: args[0] });
    if (!report) report = await Report.findOne({ messageID: args[0] });
    if (!report) return message.reply("The ID you specified doesn't exist.").then(msg => { msg.delete({ timeout: 5000 }); message.delete() });

    if (args[1] == 'attach') addAttachment(client, message, report, message.attachments.map(a => a)[0] || args.slice(2)[0]);

    else if (args[1] == 'reproduce') addReproduce(message, report, args);

    else if (args[1] == 'deleterepro' || args[1] == 'reprodelete') deleteReproduce(message, report, args);

    else if (permissionLevel >= 1) {
        var channel = message.guild.channels.cache.get(CHANNELS.APPROVED); // <-- #approved-bugs channel in C2S
        if (args[1] == 'archive') archiveReport(client, message, report);
        else if (args[1] == 'approve') fixUpReports(client, message, channel, report, args.slice(2).join(' '), true);

        else if (args[1] == 'deny') fixUpReports(client, message, channel, report, args.slice(2).join(' '), false);

    } else if (args[1] == 'approve' || args[1] == 'deny') message.reply("You do not have permission to use this.").then(msg => msg.delete({ timeout: 5000 }));
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
            if (itemIndex == -1) return message.reply("That reproduce item doesn't exist.").then(m => m.delete({ timeout: 20000 }));
            else reproduceField.splice(itemIndex, 1);
            let editedResponse = msg.embeds[0].spliceFields(4, 1, { name: "Can Reproduce", value: (reproduceField || `no one has marked this report has reproducable.`) });
            msg.edit(editedResponse);

        }).catch(err => console.log(err));
}

async function addReproduce(message, report, specifications) {
    specifications = specifications.slice(2).join(' ').replace(/\|\|/g, '').split('|');
    if (specifications.length < 2) specifications = specifications.join(' ').split('\n');
    let sysInfo = specifications[0], gameVersion = specifications[1];

    if (!sysInfo) return message.reply("You forgot to provide system information and game version.").then(msg => msg.delete({ timeout: 5000 }));
    if (!gameVersion) return message.reply("You forgot to provide the game version.").then(msg => msg.delete({ timeout: 5000 }));

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
    } else if (/https?:\/\/imgur\.com\/gallery\/\w{5,8}/.exec(item) != null) {
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