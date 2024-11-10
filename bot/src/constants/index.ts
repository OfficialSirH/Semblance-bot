import { Attachy } from '#structures/Attachy';
import type { Client } from '#structures/Client';
import { TimestampStyles, type TimestampStylesString } from '@discordjs/builders';
import { Routes, type APIGuildMember, type APIInteractionGuildMember, type APIMessageComponentInteraction, type APIUser } from '@discordjs/core';
import type { REST } from '@discordjs/rest';
import * as fs from 'fs/promises';
import type { Stream } from 'stream';

export const isProduction = process.env.NODE_ENV === 'production';
export const token = isProduction ? process.env.TOKEN : process.env.DEV_TOKEN;
export const publicKey = isProduction ? process.env.PUBLIC_KEY : process.env.DEV_PUBLIC_KEY;

export enum LogLevel {
	/**
	 * The lowest log level.
	 */
	Trace = 10,
	/**
	 * The debug level.
	 */
	Debug = 20,
	/**
	 * The info level.
	 */
	Info = 30,
	/**
	 * The warning level.
	 */
	Warn = 40,
	/**
	 * The error level.
	 */
	Error = 50,
	/**
	 * The critical level.
	 */
	Fatal = 60,
	/**
	 * An unknown or uncategorized level.
	 */
	None = 100
}

export const avatarUrl = (user: APIUser | undefined) =>
	user ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar?.startsWith('a_') ? 'gif' : 'png'}` : '';

export const userTag = (user: APIUser | undefined) => (user ? `${user.username}#${user.discriminator}` : 'Unknown User');

export const authorDefault = (user: APIUser | undefined) => ({
	name: userTag(user!),

	iconURL: avatarUrl(user!)
});

export const IdToDate = (id: string) => {
	const binary = BigInt(id).toString(2).padStart(64, '0');
	const timestamp = parseInt(binary.substring(0, 42), 2) + 1420070400000;
	return new Date(timestamp);
};

export const attachments = await (async () => {
	const files = await fs.readdir('./src/images/');
	const finalAttachments = {} as Record<
		| 'currentLogo'
		| 'sharks'
		| 'roadMap'
		| 'terminusChamber'
		| 'simStatsLocation'
		| 'geodeLevelComparison'
		| 'prestige'
		| 'prestigeList'
		| 'archieDance'
		| 'nanobots'
		| 'currency',
		Attachy
	>;
	for (const file of files)
		if (file.endsWith('.png') || file.endsWith('.mp4')) {
			const attachment = new Attachy(`./src/images/${file}`, file);

			const attachmentName = file.substring(0, file.indexOf('.'));
			finalAttachments[attachmentName as keyof typeof finalAttachments] = attachment;
		}
	return finalAttachments;
})();

export const resolveFile = (path: string | Buffer | Stream) => (typeof path === 'string' ? fs.readFile(path as string).catch(() => '') : '');

export enum BotId {
	Production = '794033850665533450',
	Development = '794049840651960350'
}

export enum UserId {
	sirh = '780995336293711875',
	// organizer
	aditya = '506458497718812674',
	// artist
	cabiie = '342004536753520651',
	// contributors
	offpringles = '299174026411114497',
	jojoseis = '325373529967296513',
	sampedrako = '651370672911679498',
	hardik = '552102291616956416'
}

export enum GuildId {
	cellToSingularity = '488478892873744385',
	computerLunch = '796153726586454077',
	sirhStuff = '794054988224659490'
}

// Early Private Beta Testers of the Beyond
export const earlyBeyondTesters = [
	'658351740470689801', // 'Maxence#6028',
	UserId.sampedrako, // 'SampeDrako#1063',
	UserId.aditya, // 'aditya20.0#1610',
	UserId.sirh, // 'SirH#7157',
	'463767995790000130', // 'iMTV ?!#9864',
	'579379819888902165', // 'elias la glaçe#6248',
	'511988453353717762', // 'JonesyyBoyy#8247',
	'201211739684077568', // 'xKeepSiLenT#3275',
	UserId.hardik, // 'Hardik Chavada#0844',
	'557915359705956375', // "C's Stuff#0421",
	'293382712276942850', // 'BlackHole-Chan#0273',
	'374266494235705344', // 'The Purple One#9049',
	'401451350023602197', // 'Ektrom#8320',
	'397847807974834186', // '✨ℭ𝕣𝕪𝕤𝕥𝕒𝕝 𝔊𝕝𝕚𝕟𝕥 ✨#0164',
	'388433470881529857', // 'g4genn#4529',
	'263156930879553537' // 'xXTacocubesXx#6012',
];

export const subcategoryList = (client: Client, category: Category, subcategory: SubCategory) =>
	client.cache.handles.commands
		.filter((c) => c.category == category && c.subCategory == subcategory)
		.map((c) => `**${c.name}**`)
		.join(', ');

export const emojis = {
	tick: '✅',
	cross: '❌',
	buffer: '⏳',
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
	darkMatter: '<:darkMatter:946592770880061450>',
	stardust: '<:stardust:808445612013518868>',
	energy: '<:energy:808445587803471922>',
	sentience: '<:sentience:808445599078809670>'
};

export const emojiSnowflakes = {
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
	darkMatter: '946592770880061450',
	stardust: '808445612013518868',
	energy: '808445587803471922',
	sentience: '808445599078809670'
};

export const customIdRegex = /(?<!.){command:'[a-z]{3,20}',action:'([a-z]|\d){1,20}(-([a-z]|\d){1,20})?',id:'\d{17,20}'(,page:\d{1,3})?}(?!.)/;

export const properCustomIdRegex =
	/(?<!.){"command":"[a-z]{3,20}","action":"([a-z]|\d){1,20}(-([a-z]|\d){1,20})?","id":"\d{17,20}"(,"page":\d{1,3})?}(?!.)/;

export const onlyUnique = (value: unknown, index: number, self: unknown[]) => self.indexOf(value) == index;

export const isDstObserved = (date: Date) => {
	const dstStart = new Date(date.getFullYear(), 2, 14, 2, 0, 0, 0);
	const dstEnd = new Date(date.getFullYear(), 10, 7, 2, 0, 0, 0);
	return date.getTime() > dstStart.getTime() && date.getTime() < dstEnd.getTime();
};

export const shortFormattedDate = (ms: number) => formattedDate(ms, TimestampStyles.ShortDateTime);

export const formattedDate = (ms: number, timestampFormat: TimestampStylesString = 'F') => `<t:${Math.floor(ms / 1000)}:${timestampFormat}>`;

export const msToTime = (ms: number) => {
	const days = Math.floor(ms / 86400000); // 24*60*60*1000
	const daysms = ms % 86400000; // 24*60*60*1000
	const hours = Math.floor(daysms / 3600000); // 60*60*1000
	const hoursms = ms % 3600000; // 60*60*1000
	const minutes = Math.floor(hoursms / 60000); // 60*1000
	const minutesms = ms % 60000; // 60*1000
	const sec = Math.floor(minutesms / 1000);

	let str = '';
	if (days) str = `${str + days}d`;
	if (hours) str = `${str + hours}h`;
	if (minutes) str = `${str + minutes}m`;
	if (sec) str = `${str + sec}s`;

	return str;
};

export enum Category {
	fun = 'fun',
	game = 'game',
	utility = 'utility',
	calculator = 'calculator',
	c2sServer = 'c2sServer',
	developer = 'developer',
	dm = 'dm',
	secret = 'secret',
	help = 'help',
	semblance = 'semblance'
}

export enum SubCategory {
	main = 'main',
	mesozoic = 'mesozoic',
	beyond = 'beyond',
	other = 'other'
}

export enum PreconditionName {
	OwnerOnly = 'OwnerOnly',
	ModOnly = 'ModOnly'
}

export const c2sRolesInformation: typeof c2sRoles = {
	server: {
		dev: 'Cell to Singularity Developer',
		eventOrganizer: 'Event Organizer',
		monthlyContestWinner: 'Monthly Contest Winner',
		serverBooster: 'Server Booster',
		muted: 'Muted',
		councilOverseer:
			'The overseers of the Cell to Singularity server, they manage everything that goes on in the Discord community and aim to make more improvements.',
		martianCouncil: "The moderators of the Cell to Singularity server, they're tasked for moderating the server.",
		alumniDev: 'contributed to the development of the game or server.',
		fanArtist: "gotten their fan art tweeted by the team's Community Manager.",
		serverEvents: 'receive pings for events happening on the server.',
		feliforms: 'participated on the feliforms team during the Feliforms vs. Caniforms event.',
		caniforms: 'participated on the caniforms team during the Feliforms vs. Caniforms event.'
	},
	simulation: {
		finderOfSemblancesSecrets: 'found all the secrets in the game.',
		sonicSpeedsterOfSimulations: 'reached singularity withn 2 minutes.',
		simulationSpeedster: 'reached singularity within 5 minutes.',
		betaTesterNotifications: 'notifications for the beta.'
	},
	metabit: {
		realityLegend: 'achieved 100 trillion metabits',
		realityExpert: 'achieved 1 trillion metabits',
		realityExplorer: 'achieved 1 billion metabits'
	},
	mesozoic: {
		paleontologistLegend: 'reached prestige 10',
		progressivePaleontologist: 'reached prestige 1',
		paleontologist: 'reached rank 26'
	},
	beyond: {
		planetaryExplorer: 'reached rank 15'
	}
};

export const c2sRoles = {
	server: {
		dev: '493796775132528640',
		councilOverseer: '567039914294771742',
		martianCouncil: '535129309648781332',
		alumniDev: '739233828064722965',
		fanArtist: '762382937668714528',
		serverEvents: '776980182070067211',
		feliforms: '808580140262359041',
		caniforms: '808580036022108202',
		eventOrganizer: '778927954763841546',
		monthlyContestWinner: '643528653883441203',
		serverBooster: '660930089990488099',
		muted: '718796622867464198'
	},
	simulation: {
		finderOfSemblancesSecrets: '1098031197516468385',
		sonicSpeedsterOfSimulations: '1098043664133017721',
		simulationSpeedster: '1098043703207149678',
		betaTesterNotifications: '564870410227679254'
	},
	metabit: {
		realityLegend: '1098043671573692508',
		realityExpert: '1098043680935399434',
		realityExplorer: '1098043698140418118'
	},
	mesozoic: {
		paleontologistLegend: '1098030259812712509',
		progressivePaleontologist: '1098043676833366076',
		paleontologist: '1098043693623148674'
	},
	beyond: {
		planetaryExplorer: '1098043684685094973'
	}
};

export const getPermissionLevel = function (member: APIGuildMember | APIInteractionGuildMember | undefined) {
	if (!member) return 0;
	if (UserId.aditya === member.user?.id || UserId.sirh === member.user?.id) return 3;
	// Aditya, SirH //RIP SirH OG: "279080959612026880" === member.user.id // SirH#4297
	if (member.roles.includes(c2sRoles.server.councilOverseer)) return 2;
	if (member.roles.includes(c2sRoles.server.martianCouncil)) return 1;
	return 0; // normal user
};

class RandomColor {
	static get randomColor() {
		let red = Math.floor(Math.random() * 256);
		let green = Math.floor(Math.random() * 256);
		let blue = Math.floor(Math.random() * 256);
		while (red < 100 || green < 100 || blue < 100) {
			if (red < 100) {
				red += Math.floor(Math.random() * 100);
			}
			if (green < 100) {
				green += Math.floor(Math.random() * 100);
			}
			if (blue < 100) {
				blue += Math.floor(Math.random() * 100);
			}
		}
		const redString = red.toString(16);
		const greenString = green.toString(16);
		const blueString = blue.toString(16);
		return parseInt(redString + greenString + blueString, 16);
	}
}
export const { randomColor } = RandomColor;

export const disableAllComponents = async (interaction: APIMessageComponentInteraction, rest?: REST) => {
	const disabledComponents = interaction.message.components?.map((component) => {
		Reflect.set(
			component,
			'components',
			component.components.map((comp) => ({ ...comp, disabled: true }))
		);
		return component;
	});

	if (!rest) return disabledComponents;

	await rest.patch(Routes.channelMessage(interaction.channel.id, interaction.message.id), {
		body: {
			components: disabledComponents
		}
	});
};

export const isUserInGuild = async (rest: REST, guildId: string, user: APIUser) => {
	try {
		const member = (await rest.get(Routes.guildMember(guildId, user.id))) as APIGuildMember | null;
		return Boolean(member);
	} catch {
		return false;
	}
};
// Command related functions and constants
export * from '#constants/commands';
export * from '#constants/largeNumberConversion';
