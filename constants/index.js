const fs = require("fs");

module.exports = {
    embedColor: 0x7289DA,
    hexColor: "7289DA",
    getPermissionLevel: (member) => { return getPermissionLevel(member) },
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
        loading: '<a:loading:572202235342225418>',
        blurple: '<:blurple:673265867840290859>',
        thumbsup: '<:thumbsup:673265868301533194>',
        birthdayhat: '<:birthdayhat:673265867995217931>',
        tickyes: '<:tickyes:673265868213452855>',
        drippingheart: '<:drippingheart:673265868318310401>',
        pingsock: '<:pingsock:673265868385550376>',
        hammer: '<:hammer:673265868414910520>',
        darkblurple: '<:darkblurple:673265868444270602>',
        tada: '<:tada:673265868188287007>',
        tickno: '<:tickno:673265868461047828>',
        star: '<:star:673265868490145825>',
        wave: '<:wave:673265868498796591>',
        weewoo: '<a:weewoo:673265868079366155>',
        sparkle: '<:sparkle:673265868603654183>',
        love: '<a:love:673265868666437632>',
        white: '<:white:673265868716638208>',
        thumbsdown: '<:thumbsdown:673265868662112269>',
        heart: '<:heart:673265871094939674>'
    },
    emojiSnowflakes: {
        loading: '572202235342225418',
        blurple: '673265867840290859',
        thumbsup: '673265868301533194',
        birthdayhat: '673265867995217931',
        tickyes: '673265868213452855',
        drippingheart: '673265868318310401',
        pingsock: '673265868385550376',
        hammer: '673265868414910520',
        darkblurple: '673265868444270602',
        tada: '673265868188287007',
        tickno: '673265868461047828',
        star: '673265868490145825',
        wave: '673265868498796591',
        weewoo: '673265868079366155',
        sparkle: '673265868603654183',
        love: '673265868666437632',
        white: '673265868716638208',
        thumbsdown: '673265868662112269',
        heart: '673265871094939674'
    },
    onlyUnique: (value, index, self) => self.indexOf(value) == index,
    flat: (input, depth = 1, stack = []) => {
        for (let item of input) if (item instanceof Array && depth > 0) module.exports.flat(item, depth - 1, stack); else stack.push(item);
        return stack;
    },
    linkRegex: /[-a-zA-Z0-9@:%._\+~#=]{2,}\.[a-zA-Z0-9()]{2,24}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/gm,
    linkDomainRegex: /[-a-zA-Z0-9@:%._\+~#=]{2,}\.[a-zA-Z0-9()]{2,24}\b/m,
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
    linkCategories: {
        // NEGATIVE
        101: 'MALWARE_OR_VIRUS',
        102: 'POOR_CUSTOMER_EXPERIENCE',
        103: 'PHISHING',
        104: 'SCAM',
        105: 'POTENTIALLY_ILLEGAL',

        // QUESTIONABLE
        201: 'MISLEADING_CLAIMS_OR_UNETHICAL',
        202: 'PRIVACY_RISKS',
        203: 'SUSPICIOUS',
        204: 'HATE_DISCRIMINTATION',
        205: 'SPAM',
        206: 'PUP',
        207: 'ADS_POPUPS',

        // NEUTRAL
        301: 'ONLINE_TRACKING',
        302: 'ALTERNATIVE_OR_CONTROVERSIAL_NATURE',
        303: 'OPINIONS_RELIGION_POLITICS',
        304: 'OTHER',

        // CHILD_SAFETY
        401: 'ADULT_CONTENT',
        402: 'INCIDENTAL_NUDITY',
        403: 'GRUESOM_OR_SHOCKING',
        404: 'SITE_FOR_KIDS',

        // POSITIVE
        501: 'GOOD_SITE',

        Meta: {
            NEGATIVE: 100,
            QUESTIONABLE: 200,
            NEURTAL: 300,
            CHILD_SAFETY: 400,
            POSITIVE: 500,
        },
    },
    badLinkCategories: [101, 103, 104, 105, 203, 204, 206, 401, 402, 403],
    staffgl: fs.existsSync("./src/constants/staffgl.json") ? require("./staffgl.json") : {},
    roles: {
        admin: "ADMINISTRATOR",
        exec: "MANAGE_GUILD",
        srmod: "MENTION_EVERYONE",
        mod: "MANAGE_CHANNELS",
        jrmod: "MANAGE_ROLES",
        helper: "MANAGE_MESSAGES",
        duty: "MUTE_MEMBERS",
    },
    cellChannels: [
        "488478893586645004",
        "496430259114082304",
        "511658545280712726",
        "506940509441490947",
        "567042187443961858",
        "694901423732686878",
        "701828451497148566",
        "545344551095894028",
        "706852533393686581",
        "494997744759603201",
        "583801966191181834",
        "573912366509457411",
        "547455179302109186",
        "547452339179487249",
        "547456263546601523",
        "547523244371214336",
        "575376892895559689",
        "575377407750438912",
        "575377775163080765",
        "575378141321756692",
        "657381330576998400",
        "657382421733441589",
        "657382925050052628",
        "658077474281881630",
        "657384128370573346",
        "657656270651916318",
        "658077773138493464"
    ],
    sirhChannels: [
        "699819649675821167",
        "699853949464739881",
        "644383888503734272",
        "699854972262678629",
        "722649613684703285"
    ]
}

function getPermissionLevel() {
    var member = arguments[0];
    try {
        if ("279080959612026880" === member.user.id || "506458497718812674" === member.user.id ||
            member.user.id == "780995336293711875") return 7; // SirH#4297, Aditya, HDevGames
        if (member.hasPermission(module.exports.roles.admin)) return 6; // admin
        if (member.hasPermission(module.exports.roles.exec)) return 5; // exec
        if (member.hasPermission(module.exports.roles.srmod)) return 4; // sr.mod
        if (member.hasPermission(module.exports.roles.mod)) return 3; // mod
        if (member.hasPermission(module.exports.roles.jrmod)) return 2; // jr.mod
        if (member.hasPermission(module.exports.roles.helper)) return 1; // helper
        return 0; // normal user
    } catch (e) {return 0}
}
