const fs = require("fs"), { Permissions } = require('discord.js');

module.exports = {
    embedColor: 0x7289DA,
    hexColor: "7289DA",
    getPermissionLevel: (member) => { return getPermissionLevel(member) },
    getAvatar: (user) => { 
        let avatarType = (user.avatar.startsWith('a_')) ? `${user.avatar}.gif` : `${user.avatar}.png`;
        return `https://cdn.discordapp.com/avatars/${user.id}/${avatarType}?size=1024` 
    },
    insertionSort: (list) => {
        for (var i = 0; i < list.length; i++) {
            curItem = list[i];
            curIndex = i - 1;
            while (curIndex >= 0 && curItem[1] > (list[curIndex])[1]) {
                list[curIndex + 1] = list[curIndex];
                curIndex--;
            }
            list[curIndex + 1] = curItem;
        }
        return list;
    },
    emojis: {
        entropy: '<:entropy:742748357163745413>',
        idea: '<:idea:775808337303437353>',
        c2s: '<:CellToSing:498910740200161280>',
        darwinium: '<:darwinium:742748359781122169>',
        metabitOG: '<:metabitOG:724684027419951177>',
        metabit: '<:metabit:789526514524880906>',
        mutagen: '<:mutagen:742748361852977184>',
        fossil: '<:fossil:742748364625543239>',
        trexBadge: '<:Dino_Gold:667471422334959619>',
        trexSkull: '<:trex_skull:657015647359860767>',
        singularity: '<:singularity:789526513812504617>',
        nanobotUp: '<:NanobotUp:764149893937102858>',
        nanobotDown: '<:NanobotDown:764149995032412180>',
        darkMatter: '<:darkMatter:808445570078867496>',
        stardust: '<:stardust:808445612013518868>',
        energy: '<:energy:808445587803471922>',
        sentience: '<:sentience:808445599078809670>'
    },
    emojiSnowflakes: {
        entropy: '742748357163745413',
        idea: '775808337303437353',
        c2s: '498910740200161280',
        darwinium: '742748359781122169',
        metabitOG: '724684027419951177',
        metabit: '789526514524880906',
        mutagen: '742748361852977184',
        fossil: '742748364625543239',
        trexBadge: '667471422334959619',
        trexSkull: '657015647359860767',
        singularity: '789526513812504617',
        nanobotUp: '764149893937102858',
        nanobotDown: '764149995032412180',
        darkMatter: '808445570078867496',
        stardust: '808445612013518868',
        energy: '808445587803471922',
        sentience: '808445599078809670'
    },
    onlyUnique: (value, index, self) => self.indexOf(value) == index,
    attachmentLinkRegex: /https?:\/\/(?:cdn\.)?discord(?:app)?\.com\/attachments\/\d{17,19}\/\d{17,20}\/(?<name>\w*\W*)(?:\.png|\.jpg|\.jpeg|\.webp|\.gif)/i,
    parseArgs: _arguments => (_arguments.match(/\"[^"]+\"|[^ ]+/g) || []).map(argument => argument.startsWith("\"") && argument.endsWith("\"") ? argument.slice(1).slice(0, -1) : argument),
    lockMessage: user => `👮 👮 ***CHANNEL IS LOCKED BY ${user}*** 👮 👮`,
    msToTime: ms => {
        days = Math.floor(ms / 86400000); // 24*60*60*1000
        daysms = ms % 86400000; // 24*60*60*1000
        hours = Math.floor(daysms / 3600000); // 60*60*1000
        hoursms = ms % 3600000; // 60*60*1000
        minutes = Math.floor(hoursms / 60000); // 60*1000
        minutesms = ms % 60000; // 60*1000
        sec = Math.floor(minutesms / 1000);

        let str = "";
        if (days) str = str + days + "d";
        if (hours) str = str + hours + "h";
        if (minutes) str = str + minutes + "m";
        if (sec) str = str + sec + "s";

        return str;
    },
    roles: {
        admin: Permissions.FLAGS.ADMINISTRATOR,
        exec: Permissions.FLAGS.MANAGE_GUILD,
        srmod: Permissions.FLAGS.MENTION_EVERYONE,
        mod: Permissions.FLAGS.MANAGE_CHANNELS,
        jrmod: Permissions.FLAGS.MANAGE_ROLES,
        helper: Permissions.FLAGS.MANAGE_MESSAGES,
        duty: Permissions.FLAGS.MUTE_MEMBERS,
    },
    cellChannels: [
        '488478893586645004', // cells-chat
        '496430259114082304', // share-your-prestige
        '511658545280712726', // suggestions
        //'822852513001766982', // suggestion-discussion
        '545344551095894028', // beta
        '694901423732686878', // cells-art
        '506940509441490947', // general
        '567042187443961858', // memes 
        '751513380413505618', // semblance
        '706852533393686581', // bot-room
        '807324470615605308', // international
        '573912366509457411', // español
        '547455179302109186', // polski
        '547452339179487249', // pyccкий
        '547456263546601523', // deutsch
        '547523244371214336', // français
        '575377407750438912', // português
        '658077773138493464', // türkçe  
    ],
    sirhChannels: [
        '794054989529874493', // general
        '794054989529874494', // memes
        '794054989529874495', // suggestions
        '794054989529874496', // bug-reports
        '794054989529874497', // bot-room
        '794054989529874500', // voice-chat
    ]
}

function getPermissionLevel(member) {
    try {
        if ("506458497718812674" === member.user.id || member.user.id == "780995336293711875") return 7;
        // Aditya, SirH //RIP SirH OG: "279080959612026880" === member.user.id // SirH#4297
        if (member.permissions.has(module.exports.roles.admin)) return 6; // admin
        if (member.permissions.has(module.exports.roles.exec)) return 5; // exec
        if (member.permissions.has(module.exports.roles.srmod)) return 4; // sr.mod
        if (member.permissions.has(module.exports.roles.mod)) return 3; // mod
        if (member.permissions.has(module.exports.roles.jrmod)) return 2; // jr.mod
        if (member.permissions.has(module.exports.roles.helper)) return 1; // helper
        return 0; // normal user
    } catch (e) {return 0}
}

class RandomColor {
	static get randomColor() {
		let red = Math.floor(Math.random()*256),
		green = Math.floor(Math.random()*256),
		blue = Math.floor(Math.random()*256);
		while(red < 100 || green < 100 || blue < 100) {
			if (red < 100) {
				red += Math.floor(Math.random()*100);
			}
			if (green < 100) {
				green += Math.floor(Math.random()*100);
			}
			if (blue < 100) {
				blue += Math.floor(Math.random()*100);
			}
		}
		red = red.toString(16);
		green = green.toString(16);
		blue = blue.toString(16);
		return "#"+red+green+blue;
	}
}

module.exports.randomColor = RandomColor.randomColor;
