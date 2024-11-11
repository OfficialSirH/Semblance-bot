import { randomColor } from '#lib/utilities/index';
import { EmbedBuilder } from '@discordjs/builders';
import { Command, RegisterCommand } from '@skyra/http-framework';
import { ApplicationIntegrationType, InteractionContextType, MessageFlags } from 'discord-api-types/v10';

@RegisterCommand((builder) =>
	builder
		.setName('privacypolicy')
		.setDescription('Get the privacy policy for Semblance.')
		.setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall)
		.setContexts(InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel)
)
export class UserCommand extends Command {
	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		const embed = new EmbedBuilder()
			.setTitle('Privacy Policy')
			.setColor(randomColor)
			.setURL('https://github.com/OfficialSirH/Semblance-bot/blob/main/Privacy%20Policy.md');

		return interaction.reply({ embeds: [embed.toJSON()], flags: MessageFlags.Ephemeral });
	}
}
